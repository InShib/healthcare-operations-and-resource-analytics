create type public.app_role as enum ('admin', 'moderator', 'user');
create type public.bed_status as enum ('available', 'occupied', 'reserved', 'maintenance');
create type public.patient_category as enum ('outpatient', 'inpatient', 'emergency');
create type public.patient_status as enum ('registered', 'admitted', 'discharged');
create type public.admission_status as enum ('admitted', 'discharged', 'transferred');
create type public.staff_role as enum ('doctor', 'nurse', 'technician', 'support');
create type public.shift_name as enum ('morning', 'evening', 'night');
create type public.equipment_status as enum ('available', 'in_use', 'maintenance', 'unavailable');
create type public.expense_category as enum ('staff', 'equipment_maintenance', 'medical_supplies', 'utilities', 'operations');
create type public.alert_severity as enum ('info', 'warning', 'critical');
create type public.dataset_status as enum ('uploaded', 'validated', 'cleaned', 'imported', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'User',
  email text,
  created_at timestamptz not null default now()
);
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Users read own profile" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Users update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)), new.email);
  insert into public.user_roles (user_id, role)
  values (new.id, case when new.email = 'admin@hospital.demo' then 'admin'::public.app_role else 'user'::public.app_role end);
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  ward text not null,
  total_beds int not null default 0 check (total_beds >= 0),
  monthly_budget numeric(12,2) not null default 0 check (monthly_budget >= 0),
  created_at timestamptz not null default now()
);
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_code text unique not null,
  category public.patient_category not null,
  department_id uuid not null references public.departments(id),
  status public.patient_status not null default 'registered',
  admitted_at timestamptz,
  discharged_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.beds (
  id uuid primary key default gen_random_uuid(),
  bed_code text unique not null,
  department_id uuid not null references public.departments(id) on delete cascade,
  ward text not null,
  status public.bed_status not null default 'available',
  patient_id uuid references public.patients(id) on delete set null,
  updated_at timestamptz not null default now()
);
create table public.admissions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  department_id uuid not null references public.departments(id),
  bed_id uuid references public.beds(id) on delete set null,
  admission_type text not null default 'planned' check (admission_type in ('planned','emergency','transfer')),
  status public.admission_status not null default 'admitted',
  admitted_at timestamptz not null,
  discharged_at timestamptz,
  created_at timestamptz not null default now(),
  check (discharged_at is null or discharged_at >= admitted_at)
);
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  staff_code text unique not null,
  full_name text not null,
  role public.staff_role not null,
  department_id uuid not null references public.departments(id) on delete cascade,
  shift public.shift_name not null default 'morning',
  employment_type text not null default 'full_time' check (employment_type in ('full_time','part_time','contract')),
  weekly_hours_scheduled numeric(5,2) not null default 40 check (weekly_hours_scheduled > 0),
  weekly_hours_assigned numeric(5,2) not null default 0 check (weekly_hours_assigned >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  equipment_code text unique not null,
  name text not null,
  category text not null,
  department_id uuid not null references public.departments(id) on delete cascade,
  status public.equipment_status not null default 'available',
  utilization_pct numeric(5,2) not null default 0 check (utilization_pct between 0 and 100),
  maintenance_due date,
  last_maintained date,
  purchase_cost numeric(12,2),
  created_at timestamptz not null default now()
);
create table public.patient_visits (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  department_id uuid not null references public.departments(id),
  visit_date date not null,
  visit_type text not null default 'outpatient' check (visit_type in ('outpatient','emergency','follow_up')),
  waiting_minutes int not null default 0 check (waiting_minutes >= 0),
  service_minutes int not null default 0 check (service_minutes >= 0),
  outcome text not null default 'treated' check (outcome in ('treated','admitted','referred')),
  created_at timestamptz not null default now()
);
create table public.operational_expenses (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  expense_month date not null,
  category public.expense_category not null,
  amount numeric(12,2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  unique (department_id, expense_month, category)
);
create table public.department_budgets (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  expense_month date not null,
  budget_amount numeric(12,2) not null check (budget_amount >= 0),
  unique (department_id, expense_month)
);
create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create table public.uploaded_datasets (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null,
  filename text not null,
  storage_path text not null,
  file_size_bytes bigint not null check (file_size_bytes >= 0),
  mime_type text not null,
  status public.dataset_status not null default 'uploaded',
  row_count int not null default 0,
  column_names jsonb not null default '[]',
  error_summary jsonb not null default '[]',
  cleaning_summary jsonb,
  created_at timestamptz not null default now()
);
create table public.processing_jobs (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.uploaded_datasets(id) on delete cascade,
  engine text not null default 'local_pipeline',
  status text not null default 'completed' check (status in ('queued','running','completed','failed')),
  rows_in int not null default 0,
  rows_out int not null default 0,
  elapsed_ms int not null default 0,
  output_summary jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  severity public.alert_severity not null default 'info',
  category text not null,
  title text not null,
  message text not null,
  department_code text,
  is_read boolean not null default false,
  is_dismissed boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_patients_department on public.patients(department_id);
create index idx_patients_status on public.patients(status);
create index idx_beds_department on public.beds(department_id);
create index idx_beds_status on public.beds(status);
create index idx_admissions_department on public.admissions(department_id);
create index idx_admissions_patient on public.admissions(patient_id);
create index idx_admissions_admitted_at on public.admissions(admitted_at);
create index idx_staff_department on public.staff(department_id);
create index idx_equipment_department on public.equipment(department_id);
create index idx_equipment_maintenance_due on public.equipment(maintenance_due);
create index idx_visits_date on public.patient_visits(visit_date);
create index idx_visits_department on public.patient_visits(department_id);
create index idx_expenses_month on public.operational_expenses(expense_month);
create index idx_jobs_dataset on public.processing_jobs(dataset_id);
create index idx_notifications_unread on public.notifications(is_read, created_at);

grant select, insert, update, delete on public.departments, public.patients, public.beds,
  public.admissions, public.staff, public.equipment, public.patient_visits,
  public.operational_expenses, public.department_budgets, public.uploaded_datasets,
  public.processing_jobs, public.notifications to authenticated;
grant select, update on public.app_settings to authenticated;
grant all on public.departments, public.patients, public.beds, public.admissions, public.staff,
  public.equipment, public.patient_visits, public.operational_expenses, public.department_budgets,
  public.app_settings, public.uploaded_datasets, public.processing_jobs, public.notifications to service_role;

alter table public.departments enable row level security;
alter table public.patients enable row level security;
alter table public.beds enable row level security;
alter table public.admissions enable row level security;
alter table public.staff enable row level security;
alter table public.equipment enable row level security;
alter table public.patient_visits enable row level security;
alter table public.operational_expenses enable row level security;
alter table public.department_budgets enable row level security;
alter table public.app_settings enable row level security;
alter table public.uploaded_datasets enable row level security;
alter table public.processing_jobs enable row level security;
alter table public.notifications enable row level security;

do $$
declare t text;
begin
  foreach t in array array['departments','patients','beds','admissions','staff','equipment','patient_visits','operational_expenses','department_budgets','uploaded_datasets','processing_jobs'] loop
    execute format('create policy "Signed-in read %1$s" on public.%1$I for select to authenticated using (true)', t);
    execute format('create policy "Admins manage %1$s" on public.%1$I for all to authenticated using (public.has_role(auth.uid(), ''admin'')) with check (public.has_role(auth.uid(), ''admin''))', t);
  end loop;
end $$;

create policy "Signed-in read settings" on public.app_settings for select to authenticated using (true);
create policy "Admins update settings" on public.app_settings for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Signed-in read notifications" on public.notifications for select to authenticated using (true);
create policy "Signed-in update notifications" on public.notifications for update to authenticated using (true) with check (true);
create policy "Admins insert notifications" on public.notifications for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete notifications" on public.notifications for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
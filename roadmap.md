# Healthcare Operations and Resource Analytics — build roadmap

Academic project (B.Tech IT, Big Data). Spec = uploaded brief. Stack substitution (confirmed): Lovable Cloud (Postgres) + TanStack Start server functions instead of Flask + SQLite; everything else per spec. Document substitution in README.

## Status legend
[ ] todo · [~] in progress · [x] done

## Phase 1 — Structure, database, seed, backend foundation
- [x] Enable Lovable Cloud + email auth
- [x] Remix setup: confirm copied migrations cleared and empty migration set rescaffolded (journal empty, verified)
- [~] Database migration: profiles, user_roles, has_role, departments, patients, admissions, beds, staff, equipment, patient_visits, operational_expenses, department_budgets, app_settings, uploaded_datasets, processing_jobs, notifications + GRANTS + RLS
- [ ] Seed: 8 departments, ~240 beds, 600+ patients, ~800 admissions (180 days), ~120 staff, ~90 equipment, ~1500 visits with waiting times, 12 months expenses + budgets, thresholds in app_settings
- [ ] Auth: /auth page (sign in + demo credentials), managed _authenticated gate, profile/role fetch, onAuthStateChange wiring
- [ ] Demo admin account creation (server-side, idempotent)

## Phase 2 — Design system + shell
- [ ] styles.css: clinical light theme (white/light gray surfaces, navy text, blue/teal accents), tokens
- [ ] App shell: collapsible sidebar, topbar (page title, date range, notifications, profile), routes under _authenticated: /dashboard /patients /beds /staff /equipment /performance /finance /bigdata /forecast /reports

## Phase 3 — Operational modules (server fns + CRUD + charts)
- [ ] Dashboard: 8 KPIs computed from data + 9 charts + filters (date, department) + rule-based summary
- [ ] Patients: searchable/sortable/paginated table + CRUD + flow/LOS stats + filters
- [ ] Beds: status overview, occupancy formula (documented, excludes maintenance from denominator), status updates persist, capacity warnings
- [ ] Staff: counts by dept/role, shifts, scheduled vs assigned, utilization, shortage thresholds
- [ ] Equipment: inventory CRUD + status updates + utilization + maintenance due alerts
- [ ] Performance: waiting time avg/median/p90, trends, throughput, bottlenecks, threshold config
- [ ] Finance: expenses by month/dept/category, MoM change, budget vs actual, cost per admission, formulas shown

## Phase 4 — Big Data module
- [ ] CSV upload → storage + validation (type/size) + preview + row/column counts + errors
- [ ] Cleaning: dates, category normalization, missing/invalid handling, duplicate flagging, derived columns (LOS, waiting duration), before/after quality summary
- [ ] Processing job: local engine (server fn), department-wise aggregation + time trends, rows in/out, elapsed time, engine label
- [ ] Import valid records into patient_visits; keep original file separate (storage)
- [ ] Hadoop ecosystem section: MapReduce (Java), Hive queries, Pig Latin, PySpark scripts — real files in bigdata/ + code viewer, clearly labelled optional/not executed
- [ ] Downloadable sample CSVs

## Phase 5 — Forecasting
- [ ] Baseline (moving average) + comparison model, MAE, department + horizon selection, limitations shown when data insufficient, rule-based planning suggestions

## Phase 6 — Reports, exports, alerts
- [ ] Reports page: 9 report types, date/department filters, CSV export, printable layout
- [ ] Notifications: rule-based alert generation (occupancy, maintenance due, long waits, dataset errors, budget overrun, resource shortage), severity/timestamp, mark read/dismiss, panel in topbar

## Phase 7 — Tests, docs
- [ ] Tests: DB init/seed, occupancy formula, waiting-time stats, aggregation, CSV validation/cleaning, forecast insufficiency, export shape
- [ ] README (overview, setup, credentials, API docs, PySpark/Hadoop/Hive/Pig execution, limitations), ER diagram, architecture diagram, project report outline, viva Q&A
- [ ] Verify end-to-end in preview (login → dashboard → modules), build green

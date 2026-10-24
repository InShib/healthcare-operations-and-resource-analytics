export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admissions: {
        Row: {
          admission_type: string
          admitted_at: string
          bed_id: string | null
          created_at: string
          department_id: string
          discharged_at: string | null
          id: string
          patient_id: string
          status: Database["public"]["Enums"]["admission_status"]
        }
        Insert: {
          admission_type?: string
          admitted_at: string
          bed_id?: string | null
          created_at?: string
          department_id: string
          discharged_at?: string | null
          id?: string
          patient_id: string
          status?: Database["public"]["Enums"]["admission_status"]
        }
        Update: {
          admission_type?: string
          admitted_at?: string
          bed_id?: string | null
          created_at?: string
          department_id?: string
          discharged_at?: string | null
          id?: string
          patient_id?: string
          status?: Database["public"]["Enums"]["admission_status"]
        }
        Relationships: [
          {
            foreignKeyName: "admissions_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      beds: {
        Row: {
          bed_code: string
          department_id: string
          id: string
          patient_id: string | null
          status: Database["public"]["Enums"]["bed_status"]
          updated_at: string
          ward: string
        }
        Insert: {
          bed_code: string
          department_id: string
          id?: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
          ward: string
        }
        Update: {
          bed_code?: string
          department_id?: string
          id?: string
          patient_id?: string | null
          status?: Database["public"]["Enums"]["bed_status"]
          updated_at?: string
          ward?: string
        }
        Relationships: [
          {
            foreignKeyName: "beds_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beds_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      department_budgets: {
        Row: {
          budget_amount: number
          department_id: string
          expense_month: string
          id: string
        }
        Insert: {
          budget_amount: number
          department_id: string
          expense_month: string
          id?: string
        }
        Update: {
          budget_amount?: number
          department_id?: string
          expense_month?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_budgets_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          id: string
          monthly_budget: number
          name: string
          total_beds: number
          ward: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          monthly_budget?: number
          name: string
          total_beds?: number
          ward: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          monthly_budget?: number
          name?: string
          total_beds?: number
          ward?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string
          created_at: string
          department_id: string
          equipment_code: string
          id: string
          last_maintained: string | null
          maintenance_due: string | null
          name: string
          purchase_cost: number | null
          status: Database["public"]["Enums"]["equipment_status"]
          utilization_pct: number
        }
        Insert: {
          category: string
          created_at?: string
          department_id: string
          equipment_code: string
          id?: string
          last_maintained?: string | null
          maintenance_due?: string | null
          name: string
          purchase_cost?: number | null
          status?: Database["public"]["Enums"]["equipment_status"]
          utilization_pct?: number
        }
        Update: {
          category?: string
          created_at?: string
          department_id?: string
          equipment_code?: string
          id?: string
          last_maintained?: string | null
          maintenance_due?: string | null
          name?: string
          purchase_cost?: number | null
          status?: Database["public"]["Enums"]["equipment_status"]
          utilization_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "equipment_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          department_code: string | null
          id: string
          is_dismissed: boolean
          is_read: boolean
          message: string
          severity: Database["public"]["Enums"]["alert_severity"]
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          department_code?: string | null
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          department_code?: string | null
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          title?: string
        }
        Relationships: []
      }
      operational_expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          department_id: string
          expense_month: string
          id: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          department_id: string
          expense_month: string
          id?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          department_id?: string
          expense_month?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operational_expenses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_visits: {
        Row: {
          created_at: string
          department_id: string
          id: string
          outcome: string
          patient_id: string
          service_minutes: number
          visit_date: string
          visit_type: string
          waiting_minutes: number
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          outcome?: string
          patient_id: string
          service_minutes?: number
          visit_date: string
          visit_type?: string
          waiting_minutes?: number
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          outcome?: string
          patient_id?: string
          service_minutes?: number
          visit_date?: string
          visit_type?: string
          waiting_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_visits_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admitted_at: string | null
          category: Database["public"]["Enums"]["patient_category"]
          created_at: string
          department_id: string
          discharged_at: string | null
          id: string
          patient_code: string
          status: Database["public"]["Enums"]["patient_status"]
        }
        Insert: {
          admitted_at?: string | null
          category: Database["public"]["Enums"]["patient_category"]
          created_at?: string
          department_id: string
          discharged_at?: string | null
          id?: string
          patient_code: string
          status?: Database["public"]["Enums"]["patient_status"]
        }
        Update: {
          admitted_at?: string | null
          category?: Database["public"]["Enums"]["patient_category"]
          created_at?: string
          department_id?: string
          discharged_at?: string | null
          id?: string
          patient_code?: string
          status?: Database["public"]["Enums"]["patient_status"]
        }
        Relationships: [
          {
            foreignKeyName: "patients_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_jobs: {
        Row: {
          created_at: string
          dataset_id: string
          elapsed_ms: number
          engine: string
          id: string
          output_summary: Json
          rows_in: number
          rows_out: number
          status: string
        }
        Insert: {
          created_at?: string
          dataset_id: string
          elapsed_ms?: number
          engine?: string
          id?: string
          output_summary?: Json
          rows_in?: number
          rows_out?: number
          status?: string
        }
        Update: {
          created_at?: string
          dataset_id?: string
          elapsed_ms?: number
          engine?: string
          id?: string
          output_summary?: Json
          rows_in?: number
          rows_out?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "uploaded_datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean
          created_at: string
          department_id: string
          employment_type: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["staff_role"]
          shift: Database["public"]["Enums"]["shift_name"]
          staff_code: string
          weekly_hours_assigned: number
          weekly_hours_scheduled: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          department_id: string
          employment_type?: string
          full_name: string
          id?: string
          role: Database["public"]["Enums"]["staff_role"]
          shift?: Database["public"]["Enums"]["shift_name"]
          staff_code: string
          weekly_hours_assigned?: number
          weekly_hours_scheduled?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          department_id?: string
          employment_type?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["staff_role"]
          shift?: Database["public"]["Enums"]["shift_name"]
          staff_code?: string
          weekly_hours_assigned?: number
          weekly_hours_scheduled?: number
        }
        Relationships: [
          {
            foreignKeyName: "staff_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      uploaded_datasets: {
        Row: {
          cleaning_summary: Json | null
          column_names: Json
          created_at: string
          error_summary: Json
          file_size_bytes: number
          filename: string
          id: string
          mime_type: string
          row_count: number
          status: Database["public"]["Enums"]["dataset_status"]
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          cleaning_summary?: Json | null
          column_names?: Json
          created_at?: string
          error_summary?: Json
          file_size_bytes: number
          filename: string
          id?: string
          mime_type: string
          row_count?: number
          status?: Database["public"]["Enums"]["dataset_status"]
          storage_path: string
          uploaded_by: string
        }
        Update: {
          cleaning_summary?: Json | null
          column_names?: Json
          created_at?: string
          error_summary?: Json
          file_size_bytes?: number
          filename?: string
          id?: string
          mime_type?: string
          row_count?: number
          status?: Database["public"]["Enums"]["dataset_status"]
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      admission_status: "admitted" | "discharged" | "transferred"
      alert_severity: "info" | "warning" | "critical"
      app_role: "admin" | "moderator" | "user"
      bed_status: "available" | "occupied" | "reserved" | "maintenance"
      dataset_status:
        | "uploaded"
        | "validated"
        | "cleaned"
        | "imported"
        | "failed"
      equipment_status: "available" | "in_use" | "maintenance" | "unavailable"
      expense_category:
        | "staff"
        | "equipment_maintenance"
        | "medical_supplies"
        | "utilities"
        | "operations"
      patient_category: "outpatient" | "inpatient" | "emergency"
      patient_status: "registered" | "admitted" | "discharged"
      shift_name: "morning" | "evening" | "night"
      staff_role: "doctor" | "nurse" | "technician" | "support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admission_status: ["admitted", "discharged", "transferred"],
      alert_severity: ["info", "warning", "critical"],
      app_role: ["admin", "moderator", "user"],
      bed_status: ["available", "occupied", "reserved", "maintenance"],
      dataset_status: [
        "uploaded",
        "validated",
        "cleaned",
        "imported",
        "failed",
      ],
      equipment_status: ["available", "in_use", "maintenance", "unavailable"],
      expense_category: [
        "staff",
        "equipment_maintenance",
        "medical_supplies",
        "utilities",
        "operations",
      ],
      patient_category: ["outpatient", "inpatient", "emergency"],
      patient_status: ["registered", "admitted", "discharged"],
      shift_name: ["morning", "evening", "night"],
      staff_role: ["doctor", "nurse", "technician", "support"],
    },
  },
} as const

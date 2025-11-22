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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      childminder_applications: {
        Row: {
          address_history: Json | null
          convictions_details: string | null
          created_at: string
          criminal_convictions: string | null
          current_address: Json | null
          current_employment: string | null
          date_of_birth: string | null
          declaration_confirmed: boolean | null
          declaration_date: string | null
          declaration_signature: string | null
          email: string | null
          employment_history: Json | null
          first_name: string | null
          gender: string | null
          health_conditions: string | null
          health_details: string | null
          id: string
          last_name: string | null
          middle_names: string | null
          national_insurance_number: string | null
          people_in_household: Json | null
          people_regular_contact: Json | null
          phone_home: string | null
          phone_mobile: string | null
          place_of_birth: string | null
          premises_address: Json | null
          premises_animal_details: string | null
          premises_animals: string | null
          premises_landlord_details: Json | null
          premises_other_residents: Json | null
          premises_ownership: string | null
          previous_names: Json | null
          previous_registration: string | null
          qualifications: Json | null
          registration_details: Json | null
          safeguarding_concerns: string | null
          safeguarding_details: string | null
          service_age_range: Json | null
          service_capacity: Json | null
          service_hours: Json | null
          service_local_authority: string | null
          service_ofsted_number: string | null
          service_ofsted_registered: string | null
          service_type: string | null
          status: string
          title: string | null
          training_courses: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_history?: Json | null
          convictions_details?: string | null
          created_at?: string
          criminal_convictions?: string | null
          current_address?: Json | null
          current_employment?: string | null
          date_of_birth?: string | null
          declaration_confirmed?: boolean | null
          declaration_date?: string | null
          declaration_signature?: string | null
          email?: string | null
          employment_history?: Json | null
          first_name?: string | null
          gender?: string | null
          health_conditions?: string | null
          health_details?: string | null
          id?: string
          last_name?: string | null
          middle_names?: string | null
          national_insurance_number?: string | null
          people_in_household?: Json | null
          people_regular_contact?: Json | null
          phone_home?: string | null
          phone_mobile?: string | null
          place_of_birth?: string | null
          premises_address?: Json | null
          premises_animal_details?: string | null
          premises_animals?: string | null
          premises_landlord_details?: Json | null
          premises_other_residents?: Json | null
          premises_ownership?: string | null
          previous_names?: Json | null
          previous_registration?: string | null
          qualifications?: Json | null
          registration_details?: Json | null
          safeguarding_concerns?: string | null
          safeguarding_details?: string | null
          service_age_range?: Json | null
          service_capacity?: Json | null
          service_hours?: Json | null
          service_local_authority?: string | null
          service_ofsted_number?: string | null
          service_ofsted_registered?: string | null
          service_type?: string | null
          status?: string
          title?: string | null
          training_courses?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_history?: Json | null
          convictions_details?: string | null
          created_at?: string
          criminal_convictions?: string | null
          current_address?: Json | null
          current_employment?: string | null
          date_of_birth?: string | null
          declaration_confirmed?: boolean | null
          declaration_date?: string | null
          declaration_signature?: string | null
          email?: string | null
          employment_history?: Json | null
          first_name?: string | null
          gender?: string | null
          health_conditions?: string | null
          health_details?: string | null
          id?: string
          last_name?: string | null
          middle_names?: string | null
          national_insurance_number?: string | null
          people_in_household?: Json | null
          people_regular_contact?: Json | null
          phone_home?: string | null
          phone_mobile?: string | null
          place_of_birth?: string | null
          premises_address?: Json | null
          premises_animal_details?: string | null
          premises_animals?: string | null
          premises_landlord_details?: Json | null
          premises_other_residents?: Json | null
          premises_ownership?: string | null
          previous_names?: Json | null
          previous_registration?: string | null
          qualifications?: Json | null
          registration_details?: Json | null
          safeguarding_concerns?: string | null
          safeguarding_details?: string | null
          service_age_range?: Json | null
          service_capacity?: Json | null
          service_hours?: Json | null
          service_local_authority?: string | null
          service_ofsted_number?: string | null
          service_ofsted_registered?: string | null
          service_type?: string | null
          status?: string
          title?: string | null
          training_courses?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const

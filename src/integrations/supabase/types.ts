export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attractions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          location_lat: number | null
          location_lng: number | null
          name: string
          rating: number | null
          updated_at: string | null
          visitors_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_lat?: number | null
          location_lng?: number | null
          name: string
          rating?: number | null
          updated_at?: string | null
          visitors_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          rating?: number | null
          updated_at?: string | null
          visitors_count?: number | null
        }
        Relationships: []
      }
      flight_arrivals: {
        Row: {
          airline_code: string | null
          airline_name: string
          created_at: string | null
          date: string
          estimated_time: string | null
          flight_number: string
          id: string
          origin: string
          scheduled_time: string
          status: string
          terminal: string | null
          updated_at: string | null
        }
        Insert: {
          airline_code?: string | null
          airline_name: string
          created_at?: string | null
          date: string
          estimated_time?: string | null
          flight_number: string
          id?: string
          origin: string
          scheduled_time: string
          status: string
          terminal?: string | null
          updated_at?: string | null
        }
        Update: {
          airline_code?: string | null
          airline_name?: string
          created_at?: string | null
          date?: string
          estimated_time?: string | null
          flight_number?: string
          id?: string
          origin?: string
          scheduled_time?: string
          status?: string
          terminal?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      occupancy_rates: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          month: string
          rate: number
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          month: string
          rate: number
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          month?: string
          rate?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      origin_countries: {
        Row: {
          color: string | null
          country_name: string
          created_at: string | null
          created_by: string | null
          id: string
          percentage: number
          updated_at: string | null
          visitor_count: number
          year: number
        }
        Insert: {
          color?: string | null
          country_name: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          percentage: number
          updated_at?: string | null
          visitor_count: number
          year: number
        }
        Update: {
          color?: string | null
          country_name?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          percentage?: number
          updated_at?: string | null
          visitor_count?: number
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      tourist_spending: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          month: string
          updated_at: string | null
          year: number
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          month: string
          updated_at?: string | null
          year: number
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          month?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      visitor_stats: {
        Row: {
          created_at: string | null
          created_by: string | null
          domestic_visitors: number
          id: string
          international_visitors: number
          month: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          domestic_visitors: number
          id?: string
          international_visitors: number
          month: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          domestic_visitors?: number
          id?: string
          international_visitors?: number
          month?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

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
      accommodation_areas: {
        Row: {
          area: string
          hotels: number
          id: string
          occupancy_rate: number
        }
        Insert: {
          area: string
          hotels: number
          id?: string
          occupancy_rate: number
        }
        Update: {
          area?: string
          hotels?: number
          id?: string
          occupancy_rate?: number
        }
        Relationships: []
      }
      accommodation_types: {
        Row: {
          id: string
          percentage: number
          type: string
        }
        Insert: {
          id?: string
          percentage: number
          type: string
        }
        Update: {
          id?: string
          percentage?: number
          type?: string
        }
        Relationships: []
      }
      age_demographics: {
        Row: {
          age_group: string
          id: string
          percentage: number
        }
        Insert: {
          age_group: string
          id?: string
          percentage: number
        }
        Update: {
          age_group?: string
          id?: string
          percentage?: number
        }
        Relationships: []
      }
      attractions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          latitude: number
          location: string
          longitude: number
          name: string
          visitor_count: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          location: string
          longitude: number
          name: string
          visitor_count: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          location?: string
          longitude?: number
          name?: string
          visitor_count?: number
        }
        Relationships: []
      }
      countries: {
        Row: {
          change: string
          id: string
          name: string
          percentage: number
          visitors: number
          year: number
        }
        Insert: {
          change: string
          id?: string
          name: string
          percentage: number
          visitors: number
          year: number
        }
        Update: {
          change?: string
          id?: string
          name?: string
          percentage?: number
          visitors?: number
          year?: number
        }
        Relationships: []
      }
      entry_points: {
        Row: {
          count: number
          id: string
          percentage: number
          type: string
        }
        Insert: {
          count: number
          id?: string
          percentage: number
          type: string
        }
        Update: {
          count?: number
          id?: string
          percentage?: number
          type?: string
        }
        Relationships: []
      }
      gender_demographics: {
        Row: {
          gender: string
          id: string
          percentage: number
        }
        Insert: {
          gender: string
          id?: string
          percentage: number
        }
        Update: {
          gender?: string
          id?: string
          percentage?: number
        }
        Relationships: []
      }
      hotel_categories: {
        Row: {
          category: string
          hotels: number
          id: string
          rate: number
          rooms: number
        }
        Insert: {
          category: string
          hotels: number
          id?: string
          rate: number
          rooms: number
        }
        Update: {
          category?: string
          hotels?: number
          id?: string
          rate?: number
          rooms?: number
        }
        Relationships: []
      }
      hotel_developments: {
        Row: {
          category: string
          completion: string
          id: string
          location: string
          name: string
          rooms: number
          status: string
        }
        Insert: {
          category: string
          completion: string
          id?: string
          location: string
          name: string
          rooms: number
          status: string
        }
        Update: {
          category?: string
          completion?: string
          id?: string
          location?: string
          name?: string
          rooms?: number
          status?: string
        }
        Relationships: []
      }
      occupancy_rates: {
        Row: {
          created_at: string | null
          id: string
          month: number
          rate: number
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          month: number
          rate: number
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          month?: number
          rate?: number
          year?: number
        }
        Relationships: []
      }
      tourist_spending: {
        Row: {
          average_spending: number
          created_at: string | null
          id: string
          month: number
          year: number
        }
        Insert: {
          average_spending: number
          created_at?: string | null
          id?: string
          month: number
          year: number
        }
        Update: {
          average_spending?: number
          created_at?: string | null
          id?: string
          month?: number
          year?: number
        }
        Relationships: []
      }
      visitors: {
        Row: {
          created_at: string | null
          domestic_count: number
          id: string
          international_count: number
          month: number
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          domestic_count: number
          id?: string
          international_count: number
          month: number
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          domestic_count?: number
          id?: string
          international_count?: number
          month?: number
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

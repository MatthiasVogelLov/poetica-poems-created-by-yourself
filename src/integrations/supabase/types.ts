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
      feature_usage: {
        Row: {
          created_at: string | null
          feature_name: string
          id: string
        }
        Insert: {
          created_at?: string | null
          feature_name: string
          id?: string
        }
        Update: {
          created_at?: string | null
          feature_name?: string
          id?: string
        }
        Relationships: []
      }
      keyword_usage: {
        Row: {
          created_at: string | null
          id: string
          keyword: string
          poem_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keyword: string
          poem_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keyword?: string
          poem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_usage_poem_id_fkey"
            columns: ["poem_id"]
            isOneToOne: false
            referencedRelation: "poem_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      poem_stats: {
        Row: {
          audience: string | null
          content_type: string | null
          created_at: string | null
          has_keywords: boolean | null
          id: string
          length: string | null
          occasion: string | null
          payment_status: string | null
          style: string | null
        }
        Insert: {
          audience?: string | null
          content_type?: string | null
          created_at?: string | null
          has_keywords?: boolean | null
          id?: string
          length?: string | null
          occasion?: string | null
          payment_status?: string | null
          style?: string | null
        }
        Update: {
          audience?: string | null
          content_type?: string | null
          created_at?: string | null
          has_keywords?: boolean | null
          id?: string
          length?: string | null
          occasion?: string | null
          payment_status?: string | null
          style?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      audience_stats: {
        Row: {
          audience: string | null
          today: number | null
          total: number | null
        }
        Relationships: []
      }
      daily_stats: {
        Row: {
          day: string | null
          paid_poems: number | null
          poems_with_keywords: number | null
          total_poems: number | null
        }
        Relationships: []
      }
      feature_usage_stats: {
        Row: {
          feature_name: string | null
          today: number | null
          total: number | null
        }
        Relationships: []
      }
      length_stats: {
        Row: {
          length: string | null
          today: number | null
          total: number | null
        }
        Relationships: []
      }
      occasion_stats: {
        Row: {
          occasion: string | null
          today: number | null
          total: number | null
        }
        Relationships: []
      }
      style_stats: {
        Row: {
          style: string | null
          today: number | null
          total: number | null
        }
        Relationships: []
      }
      tell_a_friend_stats: {
        Row: {
          today: number | null
          total: number | null
        }
        Relationships: []
      }
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

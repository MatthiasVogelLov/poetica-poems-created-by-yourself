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
      user_poems: {
        Row: {
          audience: string | null
          batch_created: boolean | null
          content: string
          content_type: string | null
          created_at: string | null
          id: string
          keywords: string | null
          length: string | null
          occasion: string | null
          status: string | null
          style: string | null
          title: string
          updated_at: string | null
          verse_type: string | null
        }
        Insert: {
          audience?: string | null
          batch_created?: boolean | null
          content: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          keywords?: string | null
          length?: string | null
          occasion?: string | null
          status?: string | null
          style?: string | null
          title: string
          updated_at?: string | null
          verse_type?: string | null
        }
        Update: {
          audience?: string | null
          batch_created?: boolean | null
          content?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          keywords?: string | null
          length?: string | null
          occasion?: string | null
          status?: string | null
          style?: string | null
          title?: string
          updated_at?: string | null
          verse_type?: string | null
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
      content_sections: {
        Row: {
          section: string | null
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
      published_poems: {
        Row: {
          batch_created: boolean | null
          content: string | null
          content_type: string | null
          created_at: string | null
          id: string | null
          length: string | null
          occasion: string | null
          status: string | null
          style: string | null
          title: string | null
          updated_at: string | null
          verse_type: string | null
        }
        Insert: {
          batch_created?: boolean | null
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string | null
          length?: string | null
          occasion?: string | null
          status?: string | null
          style?: string | null
          title?: string | null
          updated_at?: string | null
          verse_type?: string | null
        }
        Update: {
          batch_created?: boolean | null
          content?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string | null
          length?: string | null
          occasion?: string | null
          status?: string | null
          style?: string | null
          title?: string | null
          updated_at?: string | null
          verse_type?: string | null
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
      create_daily_stats_cron: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

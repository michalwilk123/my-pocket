export type Database = {
  public: {
    Tables: {
      mypocket_tag: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mypocket_link: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          note: string;
          image: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          note?: string;
          image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          note?: string;
          image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mypocket_link_tag: {
        Row: {
          link_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          link_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          link_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

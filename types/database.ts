// types/database.ts - Supabase 데이터베이스 타입 정의

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      philosophy_test_results: {
        Row: {
          id: string;
          user_id: string;
          answers: Json;
          moral_reasoning: number;
          distributive_justice: number;
          change_orientation: number;
          philosopher_type: string;
          matched_philosopher: string;
          match_percentage: number;
          rival_philosopher: string | null;
          rival_percentage: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          answers: Json;
          moral_reasoning: number;
          distributive_justice: number;
          change_orientation: number;
          philosopher_type: string;
          matched_philosopher: string;
          match_percentage: number;
          rival_philosopher?: string | null;
          rival_percentage?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          answers?: Json;
          moral_reasoning?: number;
          distributive_justice?: number;
          change_orientation?: number;
          philosopher_type?: string;
          matched_philosopher?: string;
          match_percentage?: number;
          rival_philosopher?: string | null;
          rival_percentage?: number | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          author_type: string;
          author_philosopher: string;
          agree_count: number;
          disagree_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          author_type: string;
          author_philosopher: string;
          agree_count?: number;
          disagree_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          author_type?: string;
          author_philosopher?: string;
          agree_count?: number;
          disagree_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          reaction_type: 'agree' | 'disagree';
          user_type: string;
          user_philosopher: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          reaction_type: 'agree' | 'disagree';
          user_type: string;
          user_philosopher: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          reaction_type?: 'agree' | 'disagree';
          user_type?: string;
          user_philosopher?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      posts_with_author: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          author_type: string;
          author_philosopher: string;
          agree_count: number;
          disagree_count: number;
          created_at: string;
          updated_at: string;
          philosopher_type: string | null;
          matched_philosopher: string | null;
          match_percentage: number | null;
        };
      };
      reaction_statistics: {
        Row: {
          post_id: string;
          reaction_type: 'agree' | 'disagree';
          user_type: string;
          count: number;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks to your actual credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://auvfvzlzacjukwifjdjj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dmZ2emx6YWNqdWt3aWZqZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTIyNTksImV4cCI6MjA3MzYyODI1OX0.G_uE0L2G7iNnosilYWMmoYzovGcpBxG-GRvwOWz1yBc'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// JSON type for metadata fields
export type Json = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: Json | undefined } 
  | Json[]

// Updated Database types to match your Supabase schema
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number
          username: string
          email: string
          password_hash: string
          created_at: string
          updated_at?: string
        }
        Insert: {
          user_id?: number
          username: string
          email: string
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: number
          username?: string
          email?: string
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          doc_id: number
          user_id: number
          filename: string
          contract_name: string
          parties?: string
          uploaded_on: string
          expiry_date?: string
          status: 'Active' | 'Renewal Due' | 'Expired'
          risk_score: 'Low' | 'Medium' | 'High'
          file_size?: number
          file_type?: string
        }
        Insert: {
          doc_id?: number
          user_id: number
          filename: string
          contract_name: string
          parties?: string
          uploaded_on?: string
          expiry_date?: string
          status?: 'Active' | 'Renewal Due' | 'Expired'
          risk_score?: 'Low' | 'Medium' | 'High'
          file_size?: number
          file_type?: string
        }
        Update: {
          doc_id?: number
          user_id?: number
          filename?: string
          contract_name?: string
          parties?: string
          uploaded_on?: string
          expiry_date?: string
          status?: 'Active' | 'Renewal Due' | 'Expired'
          risk_score?: 'Low' | 'Medium' | 'High'
          file_size?: number
          file_type?: string
        }
      }
      chunks: {
        Row: {
          chunk_id: number
          doc_id: number
          user_id: number
          text_chunk: string
          embedding?: number[] // 4-dimensional vector as array
          metadata?: Json // Using Json type instead of any
          page_number?: number
          chunk_index?: number
          created_at: string
        }
        Insert: {
          chunk_id?: number
          doc_id: number
          user_id: number
          text_chunk: string
          embedding?: number[]
          metadata?: Json // Using Json type instead of any
          page_number?: number
          chunk_index?: number
          created_at?: string
        }
        Update: {
          chunk_id?: number
          doc_id?: number
          user_id?: number
          text_chunk?: string
          embedding?: number[]
          metadata?: Json // Using Json type instead of any
          page_number?: number
          chunk_index?: number
          created_at?: string
        }
      }
    }
  }
}

// Type helpers for easier use
export type User = Database['public']['Tables']['users']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Chunk = Database['public']['Tables']['chunks']['Row']

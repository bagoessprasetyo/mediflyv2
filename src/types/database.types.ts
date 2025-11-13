export type Database = {
  public: {
    Tables: {
      hospitals: {
        Row: Hospital;
        Insert: Omit<Hospital, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Hospital, 'id' | 'created_at' | 'updated_at'>>;
      };
      facilities: {
        Row: Facility;
        Insert: Omit<Facility, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Facility, 'id' | 'created_at' | 'updated_at'>>;
      };
      hospital_facilities: {
        Row: HospitalFacilityRelationshipRow;
        Insert: Omit<HospitalFacilityRelationshipRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HospitalFacilityRelationshipRow, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'patient';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      hospital_type: 'GENERAL' | 'SPECIALTY' | 'TEACHING' | 'CLINIC' | 'URGENT_CARE' | 'REHABILITATION' | 'PSYCHIATRIC' | 'CHILDRENS' | 'MATERNITY' | 'MILITARY' | 'VETERANS';
      facility_category: 'DIAGNOSTIC' | 'LABORATORY' | 'PHARMACY' | 'EMERGENCY' | 'INTENSIVE_CARE' | 'OPERATING_ROOM' | 'PATIENT_ROOM' | 'CAFETERIA' | 'PARKING' | 'ACCESSIBILITY' | 'OTHER';
      access_level: 'FULL' | 'LIMITED' | 'EMERGENCY_ONLY';
    };
  };
};

export type Hospital = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  type: 'GENERAL' | 'SPECIALTY' | 'TEACHING' | 'CLINIC' | 'URGENT_CARE' | 'REHABILITATION' | 'PSYCHIATRIC' | 'CHILDRENS' | 'MATERNITY' | 'MILITARY' | 'VETERANS';
  bed_count: number | null;
  established: string | null;
  emergency_services: boolean;
  trauma_level: string | null;
  logo: string | null;
  images: string[] | null;
  virtual_tour: string | null;
  rating: number | null;
  review_count: number;
  operating_hours: Record<string, string> | null;
  is_active: boolean;
  is_verified: boolean;
  is_featured: boolean;
  metadata: Record<string, any> | null;
  // Embedding columns for semantic search
  embedding: number[] | null;
  search_vector: string | null; // tsvector is represented as string in TypeScript
  embedding_metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};

export type Facility = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: 'DIAGNOSTIC' | 'LABORATORY' | 'PHARMACY' | 'EMERGENCY' | 'INTENSIVE_CARE' | 'OPERATING_ROOM' | 'PATIENT_ROOM' | 'CAFETERIA' | 'PARKING' | 'ACCESSIBILITY' | 'OTHER';
  is_available: boolean;
  capacity: number | null;
  created_at: string;
  updated_at: string;
};

export type HospitalFacilityRelationshipRow = {
  id: string;
  hospital_id: string;
  facility_id: string;
  primary_hospital: boolean;
  access_level: 'FULL' | 'LIMITED' | 'EMERGENCY_ONLY';
  cost_sharing_percentage: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// Extended types for joined data
export type FacilityWithHospitals = Facility & {
  hospitals: (Hospital & {
    relationship: Pick<HospitalFacilityRelationshipRow, 'primary_hospital' | 'access_level' | 'cost_sharing_percentage' | 'notes'>;
  })[];
  primary_hospital?: Hospital;
};

export type HospitalWithFacilities = Hospital & {
  facilities: (Facility & {
    relationship: Pick<HospitalFacilityRelationshipRow, 'primary_hospital' | 'access_level' | 'cost_sharing_percentage' | 'notes'>;
  })[];
};
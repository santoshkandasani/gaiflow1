export interface EventItem {
  id: string;
  title: string;
  category: 'Cultural' | 'Sports';
  subcategory?: string;
  gender?: 'Boys' | 'Girls' | 'All';
  short_desc: string;
  full_desc: string;
  date: string;
  time: string;
  venue: string;
  eligibility: string;
  rules: string[];
  instructions: string;
  is_featured: number;
  image_url: string;
  icon_name: string;
}

export interface Registration {
  id: number;
  registration_id: string;
  student_type: 'internal' | 'external';
  student_name: string;
  roll_number?: string | null;
  college_name: string;
  department: string;
  year: string;
  section?: string | null;
  email: string;
  phone: string;
  event_id: string;
  event_name: string;
  participation_type: string;
  team_name?: string | null;
  team_size?: number;
  emergency_contact?: string | null;
  bus_required: number;
  bus_time?: string | null;
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
  created_at: string;
}

export interface ResultItem {
  id: number;
  event_name: string;
  category: 'Cultural' | 'Sports';
  winner: string;
  college_winner: string;
  runner_up: string;
  college_runner: string;
  score_detail?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  caption: string;
}

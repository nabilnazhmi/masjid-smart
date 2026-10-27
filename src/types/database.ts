export type UserRole = 'admin' | 'bendahara' | 'jamaah';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MosqueStructureMember {
  role: string;
  name: string;
  phone?: string;
}

export interface MosqueSettings {
  id: string;
  mosque_name: string;
  tagline: string;
  address: string;
  city: string;
  description: string;
  history?: string;
  vision?: string;
  mission?: string[];
  structure_json?: MosqueStructureMember[];
  contact_email?: string;
  contact_phone?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  qris_image_url?: string;
  prayer_api_city?: string;
  updated_at?: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  transaction_type: 'income' | 'expense';
  description?: string;
  is_public: boolean;
  created_at?: string;
}

export type TransactionStatus = 'approved' | 'pending' | 'cancelled';

export interface Transaction {
  id: string;
  transaction_date: string;
  transaction_type: 'income' | 'expense';
  category_id: string;
  category?: TransactionCategory;
  amount: number;
  description: string;
  source_destination?: string; // Donor or Vendor/Recipient
  reference_number?: string;
  proof_url?: string;
  status: TransactionStatus;
  is_public: boolean;
  created_by?: string;
  updated_by?: string;
  cancellation_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export type ActivityStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Activity {
  id: string;
  title: string;
  category: string;
  description?: string;
  speaker?: string;
  location: string;
  start_time: string;
  end_time?: string;
  status: ActivityStatus;
  poster_url?: string;
  registration_required: boolean;
  max_participants?: number;
  created_at?: string;
  updated_at?: string;
}

export type AnnouncementPriority = 'low' | 'normal' | 'urgent';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category?: string;
  priority: AnnouncementPriority;
  published_at: string;
  status: AnnouncementStatus;
  created_by?: string;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface PrayerTimes {
  date: string;
  imsak: string;
  fajr: string; // Subuh
  sunrise: string; // Terbit
  dhuhr: string; // Dzuhur
  asr: string; // Ashar
  maghrib: string; // Maghrib
  isha: string; // Isya
  locationName: string;
}

export interface FinancialSummaryData {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  incomeCount: number;
  expenseCount: number;
  periodLabel: string;
  topExpenseCategory?: {
    categoryName: string;
    totalAmount: number;
    percentage: number;
  };
  monthlyComparison?: {
    thisMonthIncome: number;
    thisMonthExpense: number;
    lastMonthIncome: number;
    lastMonthExpense: number;
    incomeChangePercent: number;
    expenseChangePercent: number;
  };
  categoriesBreakdown: {
    categoryId: string;
    categoryName: string;
    type: 'income' | 'expense';
    total: number;
    count: number;
  }[];
}

export interface AnomalyReport {
  transactionId: string;
  referenceNumber?: string;
  date: string;
  amount: number;
  categoryName: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  reasons: string[];
  suggestedAction: string;
}

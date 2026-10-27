import {
  MosqueSettings,
  TransactionCategory,
  Transaction,
  Activity,
  Announcement,
  AuditLog,
  UserProfile,
  FinancialSummaryData,
  AnomalyReport,
} from '@/types/database';
import {
  INITIAL_MOSQUE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_ACTIVITIES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  DEMO_PROFILES,
} from './demo-data';

// Local storage keys
const STORAGE_KEYS = {
  SETTINGS: 'masjidsmart_settings',
  CATEGORIES: 'masjidsmart_categories',
  TRANSACTIONS: 'masjidsmart_transactions',
  ACTIVITIES: 'masjidsmart_activities',
  ANNOUNCEMENTS: 'masjidsmart_announcements',
  AUDIT_LOGS: 'masjidsmart_audit_logs',
  CURRENT_USER: 'masjidsmart_current_user',
};

// Client-side helper for localStorage
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Deterministic Financial Calculations
 */
export function calculateFinancialSummary(
  transactions: Transaction[],
  categories: TransactionCategory[]
): FinancialSummaryData {
  const approvedTrx = transactions.filter((t) => t.status === 'approved');

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  const categoryTotals: Record<string, { total: number; count: number; name: string; type: 'income' | 'expense' }> = {};

  categories.forEach((c) => {
    categoryTotals[c.id] = { total: 0, count: 0, name: c.name, type: c.transaction_type };
  });

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let thisMonthIncome = 0;
  let thisMonthExpense = 0;
  let lastMonthIncome = 0;
  let lastMonthExpense = 0;

  approvedTrx.forEach((t) => {
    const amount = Number(t.amount);
    const date = new Date(t.transaction_date);
    const m = date.getMonth();
    const y = date.getFullYear();

    if (t.transaction_type === 'income') {
      totalIncome += amount;
      incomeCount++;
      if (y === currentYear && m === currentMonth) {
        thisMonthIncome += amount;
      } else if (
        (currentMonth === 0 && y === currentYear - 1 && m === 11) ||
        (y === currentYear && m === currentMonth - 1)
      ) {
        lastMonthIncome += amount;
      }
    } else {
      totalExpense += amount;
      expenseCount++;
      if (y === currentYear && m === currentMonth) {
        thisMonthExpense += amount;
      } else if (
        (currentMonth === 0 && y === currentYear - 1 && m === 11) ||
        (y === currentYear && m === currentMonth - 1)
      ) {
        lastMonthExpense += amount;
      }
    }

    if (t.category_id && categoryTotals[t.category_id]) {
      categoryTotals[t.category_id].total += amount;
      categoryTotals[t.category_id].count++;
    }
  });

  const currentBalance = totalIncome - totalExpense;

  // Find top expense category
  let topExpenseCategory: FinancialSummaryData['topExpenseCategory'] = undefined;
  const expenseCategories = Object.values(categoryTotals).filter((c) => c.type === 'expense' && c.total > 0);
  if (expenseCategories.length > 0) {
    const sorted = [...expenseCategories].sort((a, b) => b.total - a.total);
    const top = sorted[0];
    topExpenseCategory = {
      categoryName: top.name,
      totalAmount: top.total,
      percentage: totalExpense > 0 ? Math.round((top.total / totalExpense) * 100) : 0,
    };
  }

  // Monthly Comparison
  const incomeChangePercent = lastMonthIncome > 0
    ? Math.round(((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100)
    : 0;
  const expenseChangePercent = lastMonthExpense > 0
    ? Math.round(((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100)
    : 0;

  const categoriesBreakdown = Object.entries(categoryTotals).map(([id, val]) => ({
    categoryId: id,
    categoryName: val.name,
    type: val.type,
    total: val.total,
    count: val.count,
  }));

  return {
    totalIncome,
    totalExpense,
    currentBalance,
    incomeCount,
    expenseCount,
    periodLabel: `Semua Periode (Hingga ${new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(now)})`,
    topExpenseCategory,
    monthlyComparison: {
      thisMonthIncome,
      thisMonthExpense,
      lastMonthIncome,
      lastMonthExpense,
      incomeChangePercent,
      expenseChangePercent,
    },
    categoriesBreakdown,
  };
}

/**
 * Anomaly Detection Algorithm (Deterministic Rules)
 */
export function detectTransactionAnomalies(
  transactions: Transaction[],
  categories: TransactionCategory[]
): AnomalyReport[] {
  const reports: AnomalyReport[] = [];
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  // 1. Group by category to find average and standard deviation
  const amountsByCategory: Record<string, number[]> = {};
  transactions.forEach((t) => {
    if (t.status !== 'cancelled') {
      if (!amountsByCategory[t.category_id]) amountsByCategory[t.category_id] = [];
      amountsByCategory[t.category_id].push(Number(t.amount));
    }
  });

  const categoryStats: Record<string, { avg: number; max: number }> = {};
  Object.entries(amountsByCategory).forEach(([catId, amounts]) => {
    const sum = amounts.reduce((a, b) => a + b, 0);
    const avg = sum / amounts.length;
    categoryStats[catId] = {
      avg,
      max: Math.max(...amounts),
    };
  });

  // Track potential duplicate candidates (date + category_id + amount)
  const seenTransactions: Record<string, Transaction[]> = {};

  transactions.forEach((t) => {
    if (t.status === 'cancelled') return;

    const reasons: string[] = [];
    let severity: 'high' | 'medium' | 'low' = 'low';
    const amount = Number(t.amount);
    const catName = categoryMap.get(t.category_id) || 'Kategori Umum';

    // Check 1: Vague or too short description
    if (!t.description || t.description.trim().length < 8) {
      reasons.push('Deskripsi transaksi sangat singkat atau kurang spesifik.');
      severity = 'low';
    }

    // Check 2: Unusually large transaction (> 3x average of category)
    const stats = categoryStats[t.category_id];
    if (stats && stats.avg > 0 && amount > stats.avg * 3.5 && amount > 5000000) {
      reasons.push(`Nominal ${new Intl.NumberFormat('id-ID').format(amount)} jauh lebih tinggi dari rata-rata kategori ini (${new Intl.NumberFormat('id-ID').format(Math.round(stats.avg))}).`);
      severity = 'medium';
    }

    // Check 3: Duplicate detection candidate
    const key = `${t.transaction_date}_${t.category_id}_${amount}`;
    if (!seenTransactions[key]) {
      seenTransactions[key] = [];
    }
    seenTransactions[key].push(t);

    if (reasons.length > 0) {
      reports.push({
        transactionId: t.id,
        referenceNumber: t.reference_number,
        date: t.transaction_date,
        amount: Number(t.amount),
        categoryName: catName,
        description: t.description,
        severity,
        reasons,
        suggestedAction: 'Mohon bendahara memverifikasi dokumen bukti fisik/rekening koran untuk memastikan keabsahan transaksi.',
      });
    }
  });

  // Process duplicates
  Object.values(seenTransactions).forEach((duplicates) => {
    if (duplicates.length > 1) {
      duplicates.forEach((t) => {
        const existing = reports.find((r) => r.transactionId === t.id);
        const dupReason = `Terindikasi memiliki ${duplicates.length} transaksi serupa dengan nominal dan tanggal yang identik.`;
        if (existing) {
          if (!existing.reasons.includes(dupReason)) {
            existing.reasons.push(dupReason);
            existing.severity = 'high';
          }
        } else {
          reports.push({
            transactionId: t.id,
            referenceNumber: t.reference_number,
            date: t.transaction_date,
            amount: Number(t.amount),
            categoryName: categoryMap.get(t.category_id) || 'Kategori Umum',
            description: t.description,
            severity: 'high',
            reasons: [dupReason],
            suggestedAction: 'Periksa apakah terjadi pencatatan ganda oleh pengurus.',
          });
        }
      });
    }
  });

  return reports;
}

/**
 * Storage Manager for MasjidSmart AI
 */
export const DataStore = {
  // Settings
  getSettings(): MosqueSettings {
    const settings = getItem(STORAGE_KEYS.SETTINGS, INITIAL_MOSQUE_SETTINGS);
    // Auto-migrate if old demo name was cached in browser localStorage
    if (settings.mosque_name === 'Masjid Raya Al-Muhajirin' || !settings.mosque_name) {
      settings.mosque_name = 'Masjid Nurul Huda';
      settings.description = INITIAL_MOSQUE_SETTINGS.description;
      settings.contact_email = 'sekretariat@nurulhuda.id';
      settings.bank_account_holder = 'DKM Masjid Nurul Huda';
      setItem(STORAGE_KEYS.SETTINGS, settings);
    }
    return settings;
  },
  saveSettings(settings: MosqueSettings): MosqueSettings {
    const updated = { ...settings, updated_at: new Date().toISOString() };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    this.addAuditLog('UPDATE_SETTINGS', 'mosque_settings', updated.id, { mosque_name: updated.mosque_name });
    return updated;
  },

  // Categories
  getCategories(): TransactionCategory[] {
    return getItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategory(category: Omit<TransactionCategory, 'id'>): TransactionCategory {
    const current = this.getCategories();
    const newCat: TransactionCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.CATEGORIES, [...current, newCat]);
    this.addAuditLog('INSERT_CATEGORY', 'transaction_category', newCat.id, { name: newCat.name, type: newCat.transaction_type });
    return newCat;
  },

  // Transactions
  getTransactions(filters?: {
    type?: 'income' | 'expense' | 'all';
    status?: string;
    categoryId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    publicOnly?: boolean;
  }): Transaction[] {
    const all = getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const categories = this.getCategories();
    const catMap = new Map(categories.map((c) => [c.id, c]));

    // Attach category object
    let result = all.map((t) => ({
      ...t,
      category: catMap.get(t.category_id),
    }));

    if (!filters) return result.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());

    if (filters.publicOnly) {
      result = result.filter((t) => t.is_public && t.status === 'approved');
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter((t) => t.transaction_type === filters.type);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.categoryId && filters.categoryId !== 'all') {
      result = result.filter((t) => t.category_id === filters.categoryId);
    }

    if (filters.startDate) {
      result = result.filter((t) => t.transaction_date >= filters.startDate!);
    }

    if (filters.endDate) {
      result = result.filter((t) => t.transaction_date <= filters.endDate!);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.source_destination && t.source_destination.toLowerCase().includes(q)) ||
          (t.reference_number && t.reference_number.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  },

  addTransaction(trx: Omit<Transaction, 'id' | 'reference_number' | 'created_at' | 'updated_at'>): Transaction {
    const current = getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const dateCode = trx.transaction_date.replace(/-/g, '').slice(0, 6);
    const prefix = trx.transaction_type === 'income' ? 'TRX-IN' : 'TRX-OUT';
    const refNum = `${prefix}-${dateCode}-${String(current.length + 1).padStart(3, '0')}`;

    const newTrx: Transaction = {
      ...trx,
      id: `trx-${Date.now()}`,
      reference_number: refNum,
      amount: Number(trx.amount),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItem(STORAGE_KEYS.TRANSACTIONS, [newTrx, ...current]);
    this.addAuditLog('INSERT_TRANSACTION', 'transaction', newTrx.id, {
      amount: newTrx.amount,
      type: newTrx.transaction_type,
      ref: refNum,
    });
    return newTrx;
  },

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const current = getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const idx = current.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const updated: Transaction = {
      ...current[idx],
      ...updates,
      amount: updates.amount !== undefined ? Number(updates.amount) : current[idx].amount,
      updated_at: new Date().toISOString(),
    };

    current[idx] = updated;
    setItem(STORAGE_KEYS.TRANSACTIONS, current);
    this.addAuditLog('UPDATE_TRANSACTION', 'transaction', id, { updates });
    return updated;
  },

  cancelTransaction(id: string, cancellationReason: string): Transaction | null {
    const current = getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    const idx = current.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const updated: Transaction = {
      ...current[idx],
      status: 'cancelled',
      cancellation_reason: cancellationReason,
      updated_at: new Date().toISOString(),
    };

    current[idx] = updated;
    setItem(STORAGE_KEYS.TRANSACTIONS, current);
    this.addAuditLog('CANCEL_TRANSACTION', 'transaction', id, {
      cancellationReason,
      amount: updated.amount,
      ref: updated.reference_number,
    });
    return updated;
  },

  // Activities
  getActivities(status?: string): Activity[] {
    const all = getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    if (!status || status === 'all') {
      return all.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    }
    return all
      .filter((a) => a.status === status)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  },

  addActivity(act: Omit<Activity, 'id' | 'created_at' | 'updated_at'>): Activity {
    const current = getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const newAct: Activity = {
      ...act,
      id: `act-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.ACTIVITIES, [newAct, ...current]);
    this.addAuditLog('INSERT_ACTIVITY', 'activity', newAct.id, { title: newAct.title });
    return newAct;
  },

  updateActivity(id: string, updates: Partial<Activity>): Activity | null {
    const current = getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const idx = current.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const updated: Activity = {
      ...current[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    current[idx] = updated;
    setItem(STORAGE_KEYS.ACTIVITIES, current);
    this.addAuditLog('UPDATE_ACTIVITY', 'activity', id, { updates });
    return updated;
  },

  deleteActivity(id: string): boolean {
    const current = getItem<Activity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const filtered = current.filter((a) => a.id !== id);
    setItem(STORAGE_KEYS.ACTIVITIES, filtered);
    this.addAuditLog('DELETE_ACTIVITY', 'activity', id, {});
    return true;
  },

  // Announcements
  getAnnouncements(status?: string): Announcement[] {
    const all = getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (!status || status === 'all') {
      return all.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }
    return all
      .filter((a) => a.status === status)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  },

  addAnnouncement(ann: Omit<Announcement, 'id' | 'created_at'>): Announcement {
    const current = getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, [newAnn, ...current]);
    this.addAuditLog('INSERT_ANNOUNCEMENT', 'announcement', newAnn.id, { title: newAnn.title });
    return newAnn;
  },

  updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | null {
    const current = getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const idx = current.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const updated: Announcement = {
      ...current[idx],
      ...updates,
    };
    current[idx] = updated;
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, current);
    this.addAuditLog('UPDATE_ANNOUNCEMENT', 'announcement', id, { updates });
    return updated;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(action: string, entity_type: string, entity_id?: string, details?: Record<string, any>): void {
    const current = getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const user = this.getCurrentUser();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actor_id: user?.id,
      actor_name: user ? `${user.full_name} (${user.role})` : 'System / Pengurus',
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...current.slice(0, 99)]);
  },

  // Auth User Simulation / Session
  getCurrentUser(): UserProfile | null {
    return getItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, DEMO_PROFILES[0]); // default logged in as admin for demo
  },

  setCurrentUser(user: UserProfile | null): void {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Reset to initial demo data
  resetDemoData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  },
};

// Indian Rupee Currency Formatter
export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(absAmount);

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
};

// Date Formatter: YYYY-MM-DD to DD-MM-YYYY or readable format
export const formatDateDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}-${month}-${year}`;
    }
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
};

// Short date display (e.g., "12 Sep")
export const formatShortDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
    return dateString;
  } catch {
    return dateString;
  }
};

// Get today's date in YYYY-MM-DD
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Standard Categories definitions
export interface CategoryOption {
  key: string;
  ta: string;
  en: string;
}

export const VARAVU_CATEGORIES: CategoryOption[] = [
  { key: 'Donation', ta: 'நன்கொடை', en: 'Donation' },
  { key: 'Offering', ta: 'காணிக்கை', en: 'Offering' },
  { key: 'Sponsor', ta: 'ஸ்பான்சர்', en: 'Sponsor' },
  { key: 'Shop Contribution', ta: 'கடை பங்களிப்பு', en: 'Shop Contribution' },
  { key: 'Family Contribution', ta: 'குடும்ப பங்களிப்பு', en: 'Family Contribution' },
  { key: 'Ticket', ta: 'டிக்கெட்', en: 'Ticket' },
  { key: 'Other', ta: 'மற்றவை', en: 'Other' },
];

export const SELAVU_CATEGORIES: CategoryOption[] = [
  { key: 'General Expense', ta: 'பொது செலவு', en: 'General Expense' },
  { key: 'Food', ta: 'உணவு', en: 'Food' },
  { key: 'Sound', ta: 'சவுண்ட்', en: 'Sound' },
  { key: 'Electricity', ta: 'மின்சாரம்', en: 'Electricity' },
  { key: 'Pooja', ta: 'பூஜை', en: 'Pooja' },
  { key: 'Decoration', ta: 'அலங்காரம்', en: 'Decoration' },
  { key: 'Melam', ta: 'மேளம்', en: 'Melam' },
  { key: 'Chair / Tent', ta: 'நாற்காலி / டென்ட்', en: 'Chair / Tent' },
  { key: 'Transport', ta: 'போக்குவரத்து', en: 'Transport' },
  { key: 'Cleaning', ta: 'சுத்தம்', en: 'Cleaning' },
  { key: 'Other', ta: 'மற்றவை', en: 'Other' },
];

// Helper to translate a category label according to current language
export const getCategoryLabel = (categoryKeyOrName: string, lang: 'ta' | 'en'): string => {
  const all = [...VARAVU_CATEGORIES, ...SELAVU_CATEGORIES];
  const found = all.find(
    (c) =>
      c.key.toLowerCase() === categoryKeyOrName.toLowerCase() ||
      c.ta === categoryKeyOrName ||
      c.en.toLowerCase() === categoryKeyOrName.toLowerCase()
  );
  if (found) {
    return lang === 'ta' ? found.ta : found.en;
  }
  return categoryKeyOrName;
};

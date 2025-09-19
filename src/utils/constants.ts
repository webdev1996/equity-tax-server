// Application Constants

export const APP_CONFIG = {
  NAME: 'Equity Tax',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional Tax Management System',
  SUPPORT_EMAIL: 'support@equitytax1.com',
  SUPPORT_PHONE: '(555) 123-4567',
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  PROFILE: '/profile',
  DOCUMENTS: '/documents',
  HISTORY: '/history',
  FILING: '/filing',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const TAX_RETURN_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
} as const;

export const DOCUMENT_TYPES = {
  W2: 'w2',
  FORM_1099: '1099',
  RECEIPTS: 'receipts',
  BANK_STATEMENTS: 'bank',
  OTHER: 'other',
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const TAX_YEARS = {
  CURRENT: new Date().getFullYear(),
  PREVIOUS: new Date().getFullYear() - 1,
} as const;

export const DEDUCTION_TYPES = {
  STANDARD: 'standard',
  ITEMIZED: 'itemized',
} as const;

export const INCOME_TYPES = {
  WAGES: 'wages',
  INTEREST: 'interest',
  DIVIDENDS: 'dividends',
  BUSINESS: 'business',
  RENTAL: 'rental',
  OTHER: 'other',
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const ANALYTICS_PERIODS = {
  WEEK: '7d',
  MONTH: '30d',
  QUARTER: '90d',
  YEAR: '1y',
} as const;

export const SECURITY_SETTINGS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 30, // minutes
  LOCKOUT_DURATION: 15, // minutes
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    AVATAR: '/user/avatar',
    CHANGE_PASSWORD: '/user/change-password',
  },
  TAX: {
    RETURNS: '/tax/returns',
    RETURN_BY_ID: (id: string) => `/tax/returns/${id}`,
    SUBMIT_RETURN: (id: string) => `/tax/returns/${id}/submit`,
    DOWNLOAD_RETURN: (id: string) => `/tax/returns/${id}/download`,
  },
  DOCUMENTS: {
    LIST: '/documents',
    UPLOAD: '/documents',
    DELETE: (id: string) => `/documents/${id}`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    RETURNS: '/admin/returns',
    REVIEW_RETURN: (id: string) => `/admin/returns/${id}/review`,
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
  },
} as const;

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  SSN: /^\d{3}-?\d{2}-?\d{4}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CURRENCY: /^\d+(\.\d{2})?$/,
} as const;

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
  LANGUAGE: 'language',
  SETTINGS: 'settings',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'File type is not supported.',
  LOGIN_FAILED: 'Invalid email or password.',
  SIGNUP_FAILED: 'Failed to create account. Please try again.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  WEAK_PASSWORD: 'Password must be at least 8 characters long.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  DOCUMENT_UPLOADED: 'Document uploaded successfully!',
  RETURN_SUBMITTED: 'Tax return submitted successfully!',
  RETURN_APPROVED: 'Tax return approved!',
  RETURN_REJECTED: 'Tax return rejected.',
  SETTINGS_SAVED: 'Settings saved successfully!',
} as const;

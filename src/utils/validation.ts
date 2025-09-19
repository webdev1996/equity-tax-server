import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

// Validation utility functions
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!VALIDATION_RULES.EMAIL.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return ERROR_MESSAGES.WEAK_PASSWORD;
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return ERROR_MESSAGES.PASSWORD_MISMATCH;
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  if (!VALIDATION_RULES.PHONE.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateSSN = (ssn: string): string | null => {
  if (!ssn) return 'SSN is required';
  if (!VALIDATION_RULES.SSN.test(ssn)) return 'Please enter a valid SSN (XXX-XX-XXXX)';
  return null;
};

export const validateZipCode = (zipCode: string): string | null => {
  if (!zipCode) return 'ZIP code is required';
  if (!VALIDATION_RULES.ZIP_CODE.test(zipCode)) return 'Please enter a valid ZIP code';
  return null;
};

export const validateCurrency = (amount: string): string | null => {
  if (!amount) return 'Amount is required';
  if (!VALIDATION_RULES.CURRENCY.test(amount)) return 'Please enter a valid amount';
  if (parseFloat(amount) < 0) return 'Amount cannot be negative';
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return null;
};

export const validateFile = (file: File): string | null => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (file.size > maxSize) return ERROR_MESSAGES.FILE_TOO_LARGE;
  if (!allowedTypes.includes(file.type)) return ERROR_MESSAGES.INVALID_FILE_TYPE;
  return null;
};

export const validateDate = (date: string): string | null => {
  if (!date) return 'Date is required';
  const inputDate = new Date(date);
  const today = new Date();
  
  if (inputDate > today) return 'Date cannot be in the future';
  if (inputDate.getFullYear() < 1900) return 'Please enter a valid date';
  return null;
};

export const validateTaxYear = (year: number): string | null => {
  const currentYear = new Date().getFullYear();
  if (year < 2020 || year > currentYear) {
    return `Tax year must be between 2020 and ${currentYear}`;
  }
  return null;
};

// Form validation schemas
export const loginSchema = {
  email: validateEmail,
  password: validatePassword,
};

export const signupSchema = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
};

export const personalInfoSchema = {
  firstName: (value: string) => validateRequired(value, 'First name'),
  lastName: (value: string) => validateRequired(value, 'Last name'),
  ssn: validateSSN,
  dateOfBirth: validateDate,
  address: (value: string) => validateRequired(value, 'Address'),
  city: (value: string) => validateRequired(value, 'City'),
  state: (value: string) => validateRequired(value, 'State'),
  zipCode: validateZipCode,
};

export const incomeSchema = {
  wages: validateCurrency,
  interest: validateCurrency,
  dividends: validateCurrency,
  business: validateCurrency,
  other: validateCurrency,
};

// Utility function to validate form data
export const validateForm = (data: any, schema: any): { isValid: boolean; errors: any } => {
  const errors: any = {};
  let isValid = true;

  Object.keys(schema).forEach(field => {
    const validator = schema[field];
    const value = data[field];
    
    // Handle special case for confirmPassword validation
    if (field === 'confirmPassword') {
      const error = validator(data.password, value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    } else {
      const error = validator(value);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

// Sanitize input data
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date for display
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

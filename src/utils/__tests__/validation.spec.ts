import { describe, it, expect, vi } from 'vitest';
import {
  isValidTaiwanPhone,
  isValidEmail,
  isValidNameLength,
  hasContactInfo,
  validateTaiwanPhone,
  validateEmailFormat,
  createPhoneOrEmailValidator,
  createRequiredRule,
  createMaxLengthRule,
  createPatternRule,
} from '../validation';
// Assuming MESSAGES and VALIDATION_RULES can be imported or are mocked.
// If not, we might need to define them locally for tests.
// For now, let's assume they are accessible.
// import { MESSAGES, VALIDATION_RULES } from '@/constants/booking';

// Local fallback if actual constants are not available during test
const VALIDATION_RULES = {
  NAME_MAX_LENGTH: 20,
  PHONE_REGEX: /^09\d{8}$/,
  // A simplified regex for email validation for testing purposes
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const MESSAGES = {
  PHONE_INVALID: '請輸入有效的台灣手機號碼。',
  EMAIL_INVALID: '請輸入有效的 Email 格式。',
  CONTACT_INFO_REQUIRED: '請至少輸入手機或 Email。',
  FIELD_REQUIRED: (field: string) => `${field}為必填欄位。`,
  FIELD_MAX_LENGTH: (field: string, maxLength: number) => `${field}長度不能超過 ${maxLength} 個字元。`,
  FIELD_PATTERN: (field: string) => `${field}格式不正確。`,
};

describe('validation utils', () => {
  describe('isValidTaiwanPhone', () => {
    it('should return true for valid Taiwan phone numbers', () => {
      expect(isValidTaiwanPhone('0912345678')).toBe(true);
      expect(isValidTaiwanPhone('0987654321')).toBe(true);
    });

    it('should return false for invalid Taiwan phone numbers', () => {
      expect(isValidTaiwanPhone('091234567')).toBe(false); // Too short
      expect(isValidTaiwanPhone('09123456789')).toBe(false); // Too long
      expect(isValidTaiwanPhone('1234567890')).toBe(false); // Doesn't start with 09
      expect(isValidTaiwanPhone('abc')).toBe(false); // Not a number
      expect(isValidTaiwanPhone('')).toBe(false); // Empty
      expect(isValidTaiwanPhone(null)).toBe(false);
      expect(isValidTaiwanPhone(undefined)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('test.user+1@example.co.uk')).toBe(true);
      expect(isValidEmail('firstname.lastname@example.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false); // No TLD
      expect(isValidEmail('test.com')).toBe(false); // No @ symbol
      expect(isValidEmail('@example.com')).toBe(false); // No local part
      expect(isValidEmail('test@example..com')).toBe(false); // Double dot in domain
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidNameLength', () => {
    it('should return true for valid name lengths', () => {
      expect(isValidNameLength('陳大文')).toBe(true);
      expect(isValidNameLength('John Doe')).toBe(true);
      expect(isValidNameLength('A'.repeat(VALIDATION_RULES.NAME_MAX_LENGTH))).toBe(true);
    });

    it('should return false for empty names', () => {
      expect(isValidNameLength('')).toBe(false);
    });

    it('should return false for names exceeding max length', () => {
      expect(isValidNameLength('A'.repeat(VALIDATION_RULES.NAME_MAX_LENGTH + 1))).toBe(false);
    });

     it('should return false for null or undefined names', () => {
      expect(isValidNameLength(null)).toBe(false);
      expect(isValidNameLength(undefined)).toBe(false);
    });
  });

  describe('hasContactInfo', () => {
    it('should return true if only phone is provided', () => {
      expect(hasContactInfo('0912345678', '')).toBe(true);
      expect(hasContactInfo('0912345678', '   ')).toBe(true); // Email with only spaces
    });

    it('should return true if only email is provided', () => {
      expect(hasContactInfo('', 'test@example.com')).toBe(true);
      expect(hasContactInfo('   ', 'test@example.com')).toBe(true); // Phone with only spaces
    });

    it('should return true if both phone and email are provided', () => {
      expect(hasContactInfo('0912345678', 'test@example.com')).toBe(true);
    });

    it('should return false if both phone and email are empty or whitespace', () => {
      expect(hasContactInfo('', '')).toBe(false);
      expect(hasContactInfo('   ', '   ')).toBe(false);
      expect(hasContactInfo(null, undefined)).toBe(false);
      expect(hasContactInfo(undefined, null)).toBe(false);
    });
  });

  describe('validateTaiwanPhone (Element Plus validator)', () => {
    it('should call callback with no arguments for a valid phone number', () => {
      const callback = vi.fn();
      validateTaiwanPhone({}, '0912345678', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with an Error for an invalid phone number', () => {
      const callback = vi.fn();
      validateTaiwanPhone({}, '091234567', callback);
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.PHONE_INVALID));
    });

    it('should call callback with no arguments for an empty value', () => {
      const callback = vi.fn();
      validateTaiwanPhone({}, '', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with no arguments for null or undefined', () => {
      const cbNull = vi.fn();
      validateTaiwanPhone({}, null, cbNull);
      expect(cbNull).toHaveBeenCalledWith();

      const cbUndefined = vi.fn();
      validateTaiwanPhone({}, undefined, cbUndefined);
      expect(cbUndefined).toHaveBeenCalledWith();
    });
  });

  describe('validateEmailFormat (Element Plus validator)', () => {
    it('should call callback with no arguments for a valid email', () => {
      const callback = vi.fn();
      validateEmailFormat({}, 'test@example.com', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with an Error for an invalid email', () => {
      const callback = vi.fn();
      validateEmailFormat({}, 'test@', callback);
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.EMAIL_INVALID));
    });

    it('should call callback with no arguments for an empty value', () => {
      const callback = vi.fn();
      validateEmailFormat({}, '', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with no arguments for null or undefined', () => {
      const cbNull = vi.fn();
      validateEmailFormat({}, null, cbNull);
      expect(cbNull).toHaveBeenCalledWith();

      const cbUndefined = vi.fn();
      validateEmailFormat({}, undefined, cbUndefined);
      expect(cbUndefined).toHaveBeenCalledWith();
    });
  });

  describe('createPhoneOrEmailValidator', () => {
    const rule = {}; // Mock rule object

    it('should call callback with error if phone and email are empty', () => {
      const extraPersonForm = { phone: '', email: '' };
      const validator = createPhoneOrEmailValidator(extraPersonForm);
      const callback = vi.fn();
      validator(rule, '', callback);
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.CONTACT_INFO_REQUIRED));
    });

    it('should call callback with error if phone and email are whitespace', () => {
      const extraPersonForm = { phone: '   ', email: '   ' };
      const validator = createPhoneOrEmailValidator(extraPersonForm);
      const callback = vi.fn();
      validator(rule, '', callback); // Value here is not used by hasContactInfo
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.CONTACT_INFO_REQUIRED));
    });

    it('should call callback with no arguments if phone is present', () => {
      const extraPersonForm = { phone: '0912345678', email: '' };
      const validator = createPhoneOrEmailValidator(extraPersonForm);
      const callback = vi.fn();
      validator(rule, '', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with no arguments if email is present', () => {
      const extraPersonForm = { phone: '', email: 'test@example.com' };
      const validator = createPhoneOrEmailValidator(extraPersonForm);
      const callback = vi.fn();
      validator(rule, '', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with no arguments if both phone and email are present', () => {
      const extraPersonForm = { phone: '0912345678', email: 'test@example.com' };
      const validator = createPhoneOrEmailValidator(extraPersonForm);
      const callback = vi.fn();
      validator(rule, '', callback);
      expect(callback).toHaveBeenCalledWith();
    });
  });

  describe('createRequiredRule', () => {
    it('should return default message and trigger when no args are provided', () => {
      const rule = createRequiredRule('姓名');
      expect(rule.required).toBe(true);
      expect(rule.message).toBe(MESSAGES.FIELD_REQUIRED('姓名'));
      expect(rule.trigger).toBe('blur');
    });

    it('should use custom message and trigger when provided', () => {
      const rule = createRequiredRule('暱稱', '請輸入暱稱', 'change');
      expect(rule.required).toBe(true);
      expect(rule.message).toBe('請輸入暱稱');
      expect(rule.trigger).toBe('change');
    });
  });

  describe('createMaxLengthRule', () => {
    it('should return correct rule object', () => {
      const rule = createMaxLengthRule('備註', VALIDATION_RULES.NAME_MAX_LENGTH, 'change');
      expect(rule.max).toBe(VALIDATION_RULES.NAME_MAX_LENGTH);
      expect(rule.message).toBe(MESSAGES.FIELD_MAX_LENGTH('備註', VALIDATION_RULES.NAME_MAX_LENGTH));
      expect(rule.trigger).toBe('change');
    });

     it('should use default trigger "blur" if not provided', () => {
      const rule = createMaxLengthRule('備註', 100);
      expect(rule.trigger).toBe('blur');
    });
  });

  describe('createPatternRule', () => {
    const testPattern = /^[a-z]+$/;
    it('should return correct rule object', () => {
      const rule = createPatternRule('用戶名', testPattern, '請輸入小寫字母', 'submit');
      expect(rule.pattern).toBe(testPattern);
      expect(rule.message).toBe('請輸入小寫字母');
      expect(rule.trigger).toBe('submit');
    });

    it('should use default message and trigger if not provided', () => {
      const rule = createPatternRule('用戶名', testPattern);
      expect(rule.pattern).toBe(testPattern);
      expect(rule.message).toBe(MESSAGES.FIELD_PATTERN('用戶名'));
      expect(rule.trigger).toBe('blur');
    });
  });
});

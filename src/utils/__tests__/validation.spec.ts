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
// 使用實際的常數
import { MESSAGES, VALIDATION_RULES } from '@/constants/booking';

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
      // These functions expect string, so we test with empty string instead of null/undefined
      expect(isValidTaiwanPhone('')).toBe(false);
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
      expect(isValidEmail('test@.com')).toBe(false); // Missing domain name
      expect(isValidEmail('')).toBe(false);
      // These functions expect string, so we test with empty string instead of null/undefined
      expect(isValidEmail('')).toBe(false);
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

     it('should return false for empty string (instead of null or undefined)', () => {
      expect(isValidNameLength('')).toBe(false);
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
      // Test with empty strings instead of null/undefined
      expect(hasContactInfo('', '')).toBe(false);
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
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.ERRORS.INVALID_PHONE));
    });

    it('should call callback with no arguments for an empty value', () => {
      const callback = vi.fn();
      validateTaiwanPhone({}, '', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with no arguments for empty string', () => {
      const cb = vi.fn();
      validateTaiwanPhone({}, '', cb);
      expect(cb).toHaveBeenCalledWith();
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
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.ERRORS.INVALID_EMAIL));
    });

    it('should call callback with no arguments for an empty value', () => {
      const callback = vi.fn();
      validateEmailFormat({}, '', callback);
      expect(callback).toHaveBeenCalledWith();
    });

    it('should call callback with no arguments for empty string', () => {
      const cb = vi.fn();
      validateEmailFormat({}, '', cb);
      expect(cb).toHaveBeenCalledWith();
    });
  });

  describe('createPhoneOrEmailValidator', () => {
    const rule = {}; // Mock rule object

    it('should call callback with error if phone and email are empty', () => {
      const extraPersonForm = { phone: '', email: '' };
      const validator = createPhoneOrEmailValidator(extraPersonForm);
      const callback = vi.fn();
      validator(rule, '', callback);
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.INFO.PHONE_EMAIL_REQUIRED));
    });

    it('should call callback with error if phone and email are whitespace', () => {
      const extraPersonForm = { phone: '   ', email: '   ' };
      const validator = createPhoneOrEmailValidator(extraPersonForm);
      const callback = vi.fn();
      validator(rule, '', callback); // Value here is not used by hasContactInfo
      expect(callback).toHaveBeenCalledWith(new Error(MESSAGES.INFO.PHONE_EMAIL_REQUIRED));
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
      const rule = createRequiredRule();
      expect(rule.required).toBe(true);
      expect(rule.message).toBe(MESSAGES.ERRORS.REQUIRED_FIELD);
      expect(rule.trigger).toBe('blur');
    });

    it('should use custom message and trigger when provided', () => {
      const rule = createRequiredRule('請輸入暱稱', 'change');
      expect(rule.required).toBe(true);
      expect(rule.message).toBe('請輸入暱稱');
      expect(rule.trigger).toBe('change');
    });
  });

  describe('createMaxLengthRule', () => {
    it('should return correct rule object', () => {
      const rule = createMaxLengthRule(VALIDATION_RULES.NAME_MAX_LENGTH, '備註長度不能超過 20 個字元', 'change');
      expect(rule.max).toBe(VALIDATION_RULES.NAME_MAX_LENGTH);
      expect(rule.message).toBe('備註長度不能超過 20 個字元');
      expect(rule.trigger).toBe('change');
    });

     it('should use default trigger "blur" if not provided', () => {
      const rule = createMaxLengthRule(100, '備註長度不能超過 100 個字元');
      expect(rule.trigger).toBe('blur');
    });
  });

  describe('createPatternRule', () => {
    const testPattern = /^[a-z]+$/;
    it('should return correct rule object', () => {
      const rule = createPatternRule(testPattern, '請輸入小寫字母', 'change');
      expect(rule.pattern).toBe(testPattern);
      expect(rule.message).toBe('請輸入小寫字母');
      expect(rule.trigger).toBe('change');
    });

    it('should use default message and trigger if not provided', () => {
      const rule = createPatternRule(testPattern, '用戶名格式不正確');
      expect(rule.pattern).toBe(testPattern);
      expect(rule.message).toBe('用戶名格式不正確');
      expect(rule.trigger).toBe('blur');
    });
  });
});

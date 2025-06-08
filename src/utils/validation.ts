/**
 * Form validation utility functions.
 * Provides unified validation methods to ensure data correctness and consistency.
 */

import { VALIDATION_RULES, MESSAGES } from '@/constants/booking'
import type { ValidationCallback } from '@/types/form-validation'

/**
 * Validates Taiwan mobile phone number format.
 * @param phone - Mobile phone number.
 * @returns True if it is a valid Taiwan mobile number, false otherwise.
 */
export function isValidTaiwanPhone(phone: string): boolean {
  return VALIDATION_RULES.PHONE_PATTERN.test(phone)
}

/**
 * Validates Email format.
 * @param email - Email address.
 * @returns True if it is a valid Email, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL_PATTERN.test(email)
}

/**
 * Validates name length.
 * @param name - Name.
 * @returns True if it meets the length requirements, false otherwise.
 */
export function isValidNameLength(name: string): boolean {
  return name.length > 0 && name.length <= VALIDATION_RULES.NAME_MAX_LENGTH
}

/**
 * Checks if at least one of phone or Email is filled.
 * @param phone - Phone number.
 * @param email - Email address.
 * @returns True if at least one contact method is provided, false otherwise.
 */
export function hasContactInfo(phone: string, email: string): boolean {
  return !!(phone.trim() || email.trim())
}

/**
 * Taiwan mobile phone number validator (for Element Plus forms).
 * @param _rule - Validation rule.
 * @param value - Value to validate.
 * @param callback - Callback function.
 */
export function validateTaiwanPhone(
  _rule: unknown,
  value: string,
  callback: ValidationCallback,
): void {
  if (value && !isValidTaiwanPhone(value)) {
    callback(new Error(MESSAGES.ERRORS.INVALID_PHONE))
  } else {
    callback()
  }
}

/**
 * Email format validator (for Element Plus forms).
 * @param _rule - Validation rule.
 * @param value - Value to validate.
 * @param callback - Callback function.
 */
export function validateEmailFormat(
  _rule: unknown,
  value: string,
  callback: ValidationCallback,
): void {
  if (value && !isValidEmail(value)) {
    callback(new Error(MESSAGES.ERRORS.INVALID_EMAIL))
  } else {
    callback()
  }
}

/**
 * Phone or Email required validator (for Element Plus forms).
 * @param extraPersonForm - Extra booker form data.
 * @returns Validation function.
 */
export function createPhoneOrEmailValidator(extraPersonForm: { phone: string; email: string }) {
  return (_rule: unknown, _value: string, callback: ValidationCallback): void => {
    if (!hasContactInfo(extraPersonForm.phone, extraPersonForm.email)) {
      callback(new Error(MESSAGES.INFO.PHONE_EMAIL_REQUIRED))
    } else {
      callback()
    }
  }
}

/**
 * Creates a required validation rule.
 * @param message - Error message.
 * @param trigger - Trigger timing.
 * @returns Validation rule object.
 */
export function createRequiredRule(
  message: string = MESSAGES.ERRORS.REQUIRED_FIELD,
  trigger: 'blur' | 'change' = 'blur',
) {
  return { required: true, message, trigger }
}

/**
 * Creates a max length validation rule.
 * @param max - Maximum length.
 * @param message - Error message.
 * @param trigger - Trigger timing.
 * @returns Validation rule object.
 */
export function createMaxLengthRule(
  max: number,
  message: string,
  trigger: 'blur' | 'change' = 'blur',
) {
  return { max, message, trigger }
}

/**
 * Creates a pattern validation rule.
 * @param pattern - Regular expression.
 * @param message - Error message.
 * @param trigger - Trigger timing.
 * @returns Validation rule object.
 */
export function createPatternRule(
  pattern: RegExp,
  message: string,
  trigger: 'blur' | 'change' = 'blur',
) {
  return { pattern, message, trigger }
}

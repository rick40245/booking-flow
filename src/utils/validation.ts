/**
 * 表單驗證工具函數
 * 提供統一的驗證方法，確保資料的正確性和一致性
 */

import { VALIDATION_RULES, MESSAGES } from '@/constants/booking'
import type { ValidationCallback } from '@/types/form-validation'

/**
 * 驗證台灣手機號碼格式
 * @param phone - 手機號碼
 * @returns 是否為有效的台灣手機號碼
 */
export function isValidTaiwanPhone(phone: string): boolean {
  return VALIDATION_RULES.PHONE_PATTERN.test(phone)
}

/**
 * 驗證 Email 格式
 * @param email - Email 地址
 * @returns 是否為有效的 Email
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL_PATTERN.test(email)
}

/**
 * 驗證姓名長度
 * @param name - 姓名
 * @returns 是否符合長度限制
 */
export function isValidNameLength(name: string): boolean {
  return name.length > 0 && name.length <= VALIDATION_RULES.NAME_MAX_LENGTH
}

/**
 * 檢查電話或 Email 是否至少填寫一項
 * @param phone - 電話號碼
 * @param email - Email 地址
 * @returns 是否至少有一項聯絡方式
 */
export function hasContactInfo(phone: string, email: string): boolean {
  return !!(phone.trim() || email.trim())
}

/**
 * 台灣手機號碼驗證器（用於 Element Plus 表單）
 * @param rule - 驗證規則
 * @param value - 驗證值
 * @param callback - 回調函數
 */
export function validateTaiwanPhone(
  _rule: unknown,
  value: string,
  callback: ValidationCallback
): void {
  if (value && !isValidTaiwanPhone(value)) {
    callback(new Error(MESSAGES.ERRORS.INVALID_PHONE))
  } else {
    callback()
  }
}

/**
 * Email 格式驗證器（用於 Element Plus 表單）
 * @param rule - 驗證規則
 * @param value - 驗證值
 * @param callback - 回調函數
 */
export function validateEmailFormat(
  _rule: unknown,
  value: string,
  callback: ValidationCallback
): void {
  if (value && !isValidEmail(value)) {
    callback(new Error(MESSAGES.ERRORS.INVALID_EMAIL))
  } else {
    callback()
  }
}

/**
 * 電話或 Email 必填驗證器（用於 Element Plus 表單）
 * @param extraPersonForm - 額外預約人表單資料
 * @returns 驗證函數
 */
export function createPhoneOrEmailValidator(
  extraPersonForm: { phone: string; email: string }
) {
  return (_rule: unknown, _value: string, callback: ValidationCallback): void => {
    if (!hasContactInfo(extraPersonForm.phone, extraPersonForm.email)) {
      callback(new Error(MESSAGES.INFO.PHONE_EMAIL_REQUIRED))
    } else {
      callback()
    }
  }
}

/**
 * 創建必填驗證規則
 * @param message - 錯誤訊息
 * @param trigger - 觸發時機
 * @returns 驗證規則物件
 */
export function createRequiredRule(
  message: string = MESSAGES.ERRORS.REQUIRED_FIELD,
  trigger: 'blur' | 'change' = 'blur'
) {
  return { required: true, message, trigger }
}

/**
 * 創建長度驗證規則
 * @param max - 最大長度
 * @param message - 錯誤訊息
 * @param trigger - 觸發時機
 * @returns 驗證規則物件
 */
export function createMaxLengthRule(
  max: number,
  message: string,
  trigger: 'blur' | 'change' = 'blur'
) {
  return { max, message, trigger }
}

/**
 * 創建正則表達式驗證規則
 * @param pattern - 正則表達式
 * @param message - 錯誤訊息
 * @param trigger - 觸發時機
 * @returns 驗證規則物件
 */
export function createPatternRule(
  pattern: RegExp,
  message: string,
  trigger: 'blur' | 'change' = 'blur'
) {
  return { pattern, message, trigger }
} 
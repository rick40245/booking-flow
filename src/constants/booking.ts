/**
 * Booking Related Constant Definitions
 * Centralize all constants used in the booking process for easy maintenance and modification.
 */

/** Booking Status Enum */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

/** Booking Number Limits */
export const BOOKING_LIMITS = {
  MIN_PEOPLE: 1,
  MAX_PEOPLE: 5,
  MAX_EXTRA_PEOPLE: 4,
} as const

/** Form Default Values */
export const DEFAULT_FORM_VALUES = {
  TOTAL_PEOPLE: 1,
  DATE: '',
  TIME_SLOT: '',
  NAME: '',
  PHONE: '',
  EMAIL: '',
} as const

/** Validation Rules */
export const VALIDATION_RULES = {
  PHONE_PATTERN: /^09\d{8}$/, // Keep regex as is, it's for Taiwan phone numbers
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MAX_LENGTH: 20,
  PHONE_PLACEHOLDER: '09xxxxxxxx', // Keep placeholder as is for Taiwan phone numbers
} as const

/** Route Names */
export const ROUTE_NAMES = {
  SERVICE_LIST: 'service-list',
  BOOKING_FORM: 'booking-form',
  BOOKING_SUMMARY: 'booking-summary',
} as const

/** Storage Keys */
export const STORAGE_KEYS = {
  BOOKING_STORE: 'booking-store',
  UI_STORE: 'ui-store',
} as const

/** Time Formats */
export const TIME_FORMATS = {
  DATE_DISPLAY: 'YYYY/MM/DD',
  TIME_SLOT_FORMAT: 'HH:mm',
  ISO_DATE_SPLIT: 'T',
} as const

/** Message Texts */
export const MESSAGES = {
  ERRORS: {
    REQUIRED_FIELD: '此欄位為必填',
    INVALID_PHONE: '請輸入正確的台灣手機號碼格式',
    INVALID_EMAIL: '請輸入正確的Email格式',
    SELECT_SERVICE: '請選擇服務項目',
    SELECT_STAFF: '請選擇服務人員',
    SELECT_TIME_SLOT: '請選擇預約時段',
    DATE_PARSE_ERROR: '日期格式化錯誤',
    BOOKING_NOT_FOUND: '找不到要編輯的項目',
    DELETE_FAILED: '刪除失敗',
    NAVIGATION_FAILED: '導航失敗，請重新整理頁面',
  },
  SUCCESS: {
    BOOKING_ADDED: '預約新增成功',
    BOOKING_UPDATED: '預約更新成功',
    BOOKING_DELETED: '項目已刪除',
    EXTRA_PERSON_ADDED: '已新增額外預約人',
  },
  INFO: {
    CHECKOUT_NOT_AVAILABLE: '「前往結帳」功能尚未開放',
    PHONE_EMAIL_REQUIRED: '電話或Email必須至少填寫一項',
    FILL_EXTRA_PERSONS: '還需要新增 {count} 位額外預約人',
    EXTRA_PERSONS_EXCEEDED: '額外預約人數量超過限制，請移除多餘的預約人',
    REACHED_PERSON_LIMIT: '已達預約人數上限 ({count}人)',
  },
  CONFIRM: {
    DELETE_BOOKING: '確定要刪除此預約項目嗎？',
    LEAVE_PAGE: '你尚未完成預約流程，確定要離開嗎？',
    LEAVE_WITH_DATA: '您確定要離開嗎？未儲存的資料將會遺失。',
  },
} as const

/** Style Class Names */
export const STYLE_CLASSES = {
  SELECTED_STAFF: 'border-blue-500 bg-blue-50 shadow-md',
  DEFAULT_STAFF: 'border-gray-500 bg-white hover:border-blue-400 hover:bg-blue-25',
  SELECTED_TIME_SLOT: 'bg-blue-50 text-gray-800 border-blue-500 shadow-md',
  DEFAULT_TIME_SLOT: 'bg-white hover:bg-blue-25',
} as const

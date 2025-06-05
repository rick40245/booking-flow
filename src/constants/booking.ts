/**
 * 預約相關常數定義
 * 集中管理所有預約流程中使用的常數，便於維護和修改
 */

/** 預約狀態枚舉 */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

/** 預約人數限制 */
export const BOOKING_LIMITS = {
  MIN_PEOPLE: 1,
  MAX_PEOPLE: 5,
  MAX_EXTRA_PEOPLE: 4,
} as const

/** 表單預設值 */
export const DEFAULT_FORM_VALUES = {
  TOTAL_PEOPLE: 1,
  DATE: '',
  TIME_SLOT: '',
  NAME: '',
  PHONE: '',
  EMAIL: '',
} as const

/** 驗證規則 */
export const VALIDATION_RULES = {
  PHONE_PATTERN: /^09\d{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MAX_LENGTH: 20,
  PHONE_PLACEHOLDER: '09xxxxxxxx',
} as const

/** 路由名稱 */
export const ROUTE_NAMES = {
  SERVICE_LIST: 'service-list',
  BOOKING_FORM: 'booking-form',
  BOOKING_SUMMARY: 'booking-summary',
} as const

/** 儲存鍵值 */
export const STORAGE_KEYS = {
  BOOKING_STORE: 'booking-store',
  UI_STORE: 'ui-store',
} as const

/** 時間格式 */
export const TIME_FORMATS = {
  DATE_DISPLAY: 'YYYY/MM/DD',
  TIME_SLOT_FORMAT: 'HH:mm',
  ISO_DATE_SPLIT: 'T',
} as const

/** 訊息文字 */
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

/** 樣式類別名稱 */
export const STYLE_CLASSES = {
  SELECTED_STAFF: 'border-blue-500 bg-blue-50 shadow-md',
  DEFAULT_STAFF: 'border-gray-500 bg-white hover:border-blue-400 hover:bg-blue-25',
  SELECTED_TIME_SLOT: 'bg-blue-50 text-gray-800 border-blue-500 shadow-md',
  DEFAULT_TIME_SLOT: 'bg-white hover:bg-blue-25',
} as const

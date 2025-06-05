/**
 * 預約系統相關的 TypeScript 類型定義
 * 集中管理所有預約流程中使用的介面和類型
 */

/**
 * 使用者基本資訊介面
 */
export interface UserInfo {
  name: string
  phone: string
  email: string
}

/**
 * 額外預約人介面
 */
export interface ExtraPerson extends UserInfo {
  // 未來可擴充其他欄位
}

/**
 * 預約表單資料介面
 */
export interface BookingFormData {
  /** 預約總人數 */
  totalPeople: number
  /** 預約日期 (YYYY-MM-DD) */
  date: string
  /** 預約時段 (HH:mm) */
  timeSlot: string
  /** 主要預約人姓名 */
  name: string
  /** 主要預約人電話 */
  phone: string
  /** 主要預約人 Email */
  email: string
  /** 額外預約人列表 */
  extraPersons: ExtraPerson[]
  /** 服務項目 ID */
  serviceId?: number
  /** 選擇的服務人員 ID */
  selectedStaffId?: number
}

/**
 * 預約狀態類型
 */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

/**
 * 完整預約資料介面（包含系統資訊）
 */
export interface BookingData extends BookingFormData {
  /** 預約唯一識別碼 */
  id?: string
  /** 預約狀態 */
  status?: BookingStatus
  /** 建立時間 (ISO 8601) */
  createdAt?: string
  /** 更新時間 (ISO 8601) */
  updatedAt?: string
}

/**
 * 預約項目介面（舊版，待廢棄）
 * @deprecated 使用 BookingData 代替
 */
export interface BookingItem {
  serviceId: number | null
  date: string | null
  slot: string | null
  primaryUser: UserInfo
  extraUsers: UserInfo[]
}

/**
 * 預約顯示資訊介面（用於列表展示）
 */
export interface BookingDisplayInfo extends BookingData {
  /** 原始索引（用於編輯） */
  originalIndex: number
  /** 服務名稱 */
  serviceName: string
  /** 服務人員名稱 */
  staffName: string
  /** 價格 */
  price: number
  /** 格式化的日期時間 */
  formattedDateTime: string
  /** 主要預約人顯示文字 */
  mainPersonDisplay: string
  /** 額外預約人顯示文字陣列 */
  extraPersonsDisplay: string[]
}

/**
 * 預約驗證結果介面
 */
export interface BookingValidationResult {
  /** 是否有效 */
  isValid: boolean
  /** 錯誤訊息 */
  errorMessage?: string
  /** 錯誤欄位 */
  errorField?: keyof BookingFormData
}

/**
 * 預約統計資訊介面
 */
export interface BookingStatistics {
  /** 總預約數 */
  totalBookings: number
  /** 待確認預約數 */
  pendingBookings: number
  /** 已確認預約數 */
  confirmedBookings: number
  /** 已取消預約數 */
  cancelledBookings: number
  /** 總金額 */
  totalAmount: number
}

/**
 * 預約篩選條件介面
 */
export interface BookingFilterCriteria {
  /** 狀態篩選 */
  status?: BookingStatus
  /** 日期範圍 - 開始日期 */
  startDate?: string
  /** 日期範圍 - 結束日期 */
  endDate?: string
  /** 服務項目 ID */
  serviceId?: number
  /** 服務人員 ID */
  staffId?: number
  /** 搜尋關鍵字（姓名、電話） */
  keyword?: string
}

/**
 * 預約排序選項
 */
export type BookingSortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'status'

/**
 * 預約列表查詢參數介面
 */
export interface BookingQueryParams {
  /** 篩選條件 */
  filters?: BookingFilterCriteria
  /** 排序選項 */
  sortBy?: BookingSortOption
  /** 頁碼（從 1 開始） */
  page?: number
  /** 每頁筆數 */
  pageSize?: number
}

/**
 * 預約列表回應介面
 */
export interface BookingListResponse {
  /** 預約資料陣列 */
  items: BookingData[]
  /** 總筆數 */
  total: number
  /** 當前頁碼 */
  page: number
  /** 每頁筆數 */
  pageSize: number
  /** 總頁數 */
  totalPages: number
} 
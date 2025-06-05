/**
 * 服務系統相關的 TypeScript 類型定義
 * 集中管理所有服務和人員相關的介面和類型
 */

/**
 * 服務人員基本資訊介面
 */
export interface Staff {
  /** 服務人員 ID */
  id: number
  /** 服務人員姓名 */
  name: string
  /** 服務價格（每小時） */
  price: number
  /** 工作時間描述 */
  workTime: string
  /** 可用時段陣列 */
  availableSlots: string[]
  /** 不可用時段陣列（如午休） */
  unavailableSlots?: string[]
  /** 服務人員照片 URL */
  avatar?: string
  /** 服務人員描述 */
  description?: string
  /** 評分（1-5） */
  rating?: number
  /** 服務次數 */
  serviceCount?: number
}

/**
 * 服務項目介面
 */
export interface Service {
  /** 服務 ID */
  id: number
  /** 服務名稱 */
  name: string
  /** 服務類型標識 */
  serviceType: string
  /** 提供此服務的人員 ID 陣列 */
  staffIds: number[]
  /** 服務描述 */
  description?: string
  /** 服務時長（分鐘） */
  duration?: number
  /** 服務圖片 URL */
  imageUrl?: string
  /** 是否啟用 */
  isActive?: boolean
}

/**
 * 服務類型枚舉
 */
export enum ServiceType {
  FACIAL = 'facial',
  MASSAGE = 'massage',
  STYLING = 'styling',
}

/**
 * 服務類型資訊介面
 */
export interface ServiceTypeInfo {
  /** 類型標識 */
  type: ServiceType | string
  /** 類型名稱 */
  name: string
  /** 類型描述 */
  description?: string
  /** 圖示名稱或 URL */
  icon?: string
}

/**
 * 服務人員擴展資訊介面（用於頁面顯示）
 */
export interface StaffDisplayInfo {
  /** 服務項目 ID */
  serviceId: number
  /** 服務人員 ID */
  staffId: number
  /** 服務人員姓名 */
  staffName: string
  /** 工作時間 */
  workTime: string
  /** 價格 */
  price: number
  /** 可用時段 */
  availableSlots: string[]
}

/**
 * 服務統計資訊介面
 */
export interface ServiceStatistics {
  /** 服務 ID */
  serviceId: number
  /** 總預約數 */
  totalBookings: number
  /** 總收入 */
  totalRevenue: number
  /** 平均評分 */
  averageRating: number
  /** 取消率 */
  cancellationRate: number
}

/**
 * 服務人員統計資訊介面
 */
export interface StaffStatistics {
  /** 服務人員 ID */
  staffId: number
  /** 總服務次數 */
  totalServices: number
  /** 總收入 */
  totalRevenue: number
  /** 平均評分 */
  averageRating: number
  /** 預約滿意度 */
  satisfactionRate: number
  /** 本月服務次數 */
  monthlyServices: number
}

/**
 * 時段可用性介面
 */
export interface SlotAvailability {
  /** 時段 */
  slot: string
  /** 是否可用 */
  isAvailable: boolean
  /** 不可用原因 */
  unavailableReason?: 'booked' | 'break' | 'off-work' | 'holiday'
}

/**
 * 服務人員排班介面
 */
export interface StaffSchedule {
  /** 服務人員 ID */
  staffId: number
  /** 日期 (YYYY-MM-DD) */
  date: string
  /** 是否工作日 */
  isWorkingDay: boolean
  /** 工作時段 */
  workingSlots?: string[]
  /** 休息時段 */
  breakSlots?: string[]
  /** 已預約時段 */
  bookedSlots?: string[]
}

/**
 * 服務價格規則介面
 */
export interface PriceRule {
  /** 規則 ID */
  id: number
  /** 服務 ID */
  serviceId: number
  /** 規則類型 */
  type: 'weekday' | 'weekend' | 'holiday' | 'member' | 'promotion'
  /** 價格調整（可以是固定金額或百分比） */
  adjustment: number
  /** 是否為百分比 */
  isPercentage: boolean
  /** 生效開始日期 */
  startDate?: string
  /** 生效結束日期 */
  endDate?: string
  /** 規則描述 */
  description?: string
}

/**
 * 服務套餐介面
 */
export interface ServicePackage {
  /** 套餐 ID */
  id: number
  /** 套餐名稱 */
  name: string
  /** 包含的服務 ID 陣列 */
  serviceIds: number[]
  /** 套餐價格 */
  price: number
  /** 原價（用於顯示折扣） */
  originalPrice: number
  /** 套餐描述 */
  description?: string
  /** 有效期限（天） */
  validityDays?: number
  /** 是否啟用 */
  isActive: boolean
}

/**
 * 服務分類介面
 */
export interface ServiceCategory {
  /** 分類 ID */
  id: number
  /** 分類名稱 */
  name: string
  /** 父分類 ID */
  parentId?: number
  /** 排序順序 */
  sortOrder: number
  /** 分類描述 */
  description?: string
  /** 是否顯示 */
  isVisible: boolean
}

/**
 * 服務搜尋參數介面
 */
export interface ServiceSearchParams {
  /** 關鍵字 */
  keyword?: string
  /** 服務類型 */
  serviceType?: string
  /** 價格範圍 - 最低價 */
  minPrice?: number
  /** 價格範圍 - 最高價 */
  maxPrice?: number
  /** 可用日期 */
  availableDate?: string
  /** 可用時段 */
  availableSlot?: string
  /** 服務人員 ID */
  staffId?: number
  /** 分類 ID */
  categoryId?: number
}

/**
 * 服務評價介面
 */
export interface ServiceReview {
  /** 評價 ID */
  id: number
  /** 預約 ID */
  bookingId: string
  /** 服務 ID */
  serviceId: number
  /** 服務人員 ID */
  staffId: number
  /** 評分（1-5） */
  rating: number
  /** 評價內容 */
  comment?: string
  /** 評價者姓名 */
  reviewerName: string
  /** 評價時間 */
  createdAt: string
  /** 是否已驗證 */
  isVerified: boolean
}

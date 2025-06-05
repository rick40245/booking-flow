import { defineStore } from 'pinia'
import type { Service } from './servicesStore'
import { 
  BOOKING_STATUS, 
  DEFAULT_FORM_VALUES, 
  STORAGE_KEYS,
  type BookingStatus 
} from '@/constants/booking'
import { formatISODate } from '@/utils/date'

/**
 * 使用者資訊介面
 */
export interface UserInfo {
  name: string
  phone: string
  email: string
}

/**
 * 額外預約人介面
 */
export interface ExtraPerson {
  name: string
  phone: string
  email: string
}

/**
 * 預約表單資料介面
 */
export interface BookingFormData {
  totalPeople: number
  date: string
  timeSlot: string
  name: string
  phone: string
  email: string
  extraPersons: ExtraPerson[]
  serviceId?: number
  selectedStaffId?: number
}

/**
 * 預約資料介面（包含狀態和時間戳記）
 */
export interface BookingData extends BookingFormData {
  id?: string
  status?: BookingStatus
  createdAt?: string
}

/**
 * 預約項目介面（舊版，待重構）
 */
export interface BookingItem {
  serviceId: number | null
  date: string | null
  slot: string | null
  primaryUser: UserInfo
  extraUsers: UserInfo[]
}

/**
 * 創建空的預約表單資料
 */
function createEmptyFormData(): BookingFormData {
  return {
    totalPeople: DEFAULT_FORM_VALUES.TOTAL_PEOPLE,
    date: DEFAULT_FORM_VALUES.DATE,
    timeSlot: DEFAULT_FORM_VALUES.TIME_SLOT,
    name: DEFAULT_FORM_VALUES.NAME,
    phone: DEFAULT_FORM_VALUES.PHONE,
    email: DEFAULT_FORM_VALUES.EMAIL,
    extraPersons: [],
    selectedStaffId: undefined
  }
}

/**
 * 創建空的預約項目
 */
function createEmptyBookingItem(): BookingItem {
  return {
    serviceId: null,
    date: null,
    slot: null,
    primaryUser: {
      name: DEFAULT_FORM_VALUES.NAME,
      phone: DEFAULT_FORM_VALUES.PHONE,
      email: DEFAULT_FORM_VALUES.EMAIL
    },
    extraUsers: []
  }
}

/**
 * 預約 Store
 * 管理所有預約相關的狀態和操作
 */
export const useBookingStore = defineStore('booking', {
  state: () => ({
    // 購物車相關（舊版，待移除）
    cart: [] as BookingItem[],
    currentBooking: createEmptyBookingItem(),
    
    // 服務選擇狀態
    selectedServiceId: null as number | null,
    selectedStaffId: null as number | null,
    selectedServiceIds: [] as number[],
    
    // 預約資料（待重構）
    bookingData: null as BookingData | null,
    bookingItems: [] as BookingData[],
    
    // 表單資料
    formData: createEmptyFormData(),
    
    // 預約歷史
    bookingHistory: [] as BookingData[],
    
    // 編輯狀態
    editingItemIndex: null as number | null
  }),
  
  getters: {
    /**
     * 檢查是否有未完成的舊版表單
     */
    hasUnfinishedForm(state): boolean {
      const booking = state.currentBooking
      return !!(
        booking.serviceId || 
        booking.date || 
        booking.slot || 
        booking.primaryUser.name || 
        booking.primaryUser.phone || 
        booking.primaryUser.email || 
        booking.extraUsers.length > 0
      )
    },
    
    /**
     * 檢查是否有表單資料
     */
    hasFormData(state): boolean {
      const form = state.formData
      return !!(
        form.name || 
        form.phone || 
        form.email || 
        form.date || 
        form.timeSlot || 
        form.extraPersons.length > 0
      )
    },
    
    /**
     * 是否為編輯模式
     */
    isEditMode(state): boolean {
      return state.editingItemIndex !== null
    },
    
    /**
     * 取得當前編輯的項目
     */
    editingItem(state): BookingData | null {
      if (state.editingItemIndex === null) return null
      return state.bookingHistory[state.editingItemIndex] || null
    }
  },
  
  actions: {
    // ========== 購物車操作（舊版，待移除） ==========
    
    addToCart(service: Service) {
      this.currentBooking.serviceId = service.id
      this.cart.push({ ...this.currentBooking })
      this.resetCurrentBooking()
    },
    
    updateCurrentBooking(data: Partial<BookingItem>) {
      this.currentBooking = { ...this.currentBooking, ...data }
    },
    
    resetCurrentBooking() {
      this.currentBooking = createEmptyBookingItem()
    },
    
    removeFromCart(index: number) {
      this.cart.splice(index, 1)
    },
    
    editBooking(index: number) {
      this.currentBooking = { ...this.cart[index] }
      this.cart.splice(index, 1)
    },
    
    calculateTotal() {
      // TODO: 實作價格計算邏輯
      return this.cart.reduce((total) => total, 0)
    },
    
    submitBooking() {
      this.cart = []
      return true
    },
    
    // ========== 服務選擇操作 ==========
    
    /**
     * 切換服務選擇狀態
     */
    toggleServiceSelection(serviceId: number) {
      const idx = this.selectedServiceIds.indexOf(serviceId)
      if (idx === -1) {
        this.selectedServiceIds.push(serviceId)
      } else {
        this.selectedServiceIds.splice(idx, 1)
      }
    },
    
    /**
     * 設定選中的服務
     */
    setSelectedService(serviceId: number) {
      this.selectedServiceId = serviceId
      this.formData.serviceId = serviceId
      
      // 只在非編輯模式下清除選中的服務人員
      if (!this.isEditMode) {
        this.selectedStaffId = null
        this.formData.selectedStaffId = undefined
        this.formData.timeSlot = ''
      }
    },
    
    /**
     * 設定選中的服務人員
     */
    setSelectedStaff(staffId: number) {
      this.selectedStaffId = staffId
      this.formData.selectedStaffId = staffId
      this.formData.timeSlot = '' // 更換服務人員時清除時段
    },
    
    // ========== 表單資料操作 ==========
    
    /**
     * 設定預約資料
     */
    setBookingData(data: BookingFormData) {
      this.formData = { ...data }
    },
    
    /**
     * 更新表單資料
     */
    updateFormData(data: Partial<BookingFormData>) {
      this.formData = { ...this.formData, ...data }
      
      // 同步 selectedStaffId
      if (data.selectedStaffId !== undefined) {
        this.selectedStaffId = data.selectedStaffId || null
      }
      
      // 確保 serviceId 與 selectedServiceId 保持同步
      if (this.selectedServiceId && !this.formData.serviceId) {
        this.formData.serviceId = this.selectedServiceId
      }
    },
    
    /**
     * 清除表單資料
     */
    clearFormData() {
      this.formData = createEmptyFormData()
    },
    
    // ========== 預約歷史操作 ==========
    
    /**
     * 新增或更新預約
     */
    addBooking(booking: BookingData) {
      if (this.isEditMode && this.editingItemIndex !== null) {
        // 編輯模式：更新現有預約
        const existingBooking = this.bookingHistory[this.editingItemIndex]
        this.bookingHistory[this.editingItemIndex] = {
          ...booking,
          id: existingBooking.id,
          status: existingBooking.status,
          createdAt: existingBooking.createdAt
        }
        this.clearEditingItemIndex()
      } else {
        // 新增模式：創建新預約
        const newBooking: BookingData = {
          ...booking,
          id: Date.now().toString(),
          status: BOOKING_STATUS.PENDING,
          createdAt: new Date().toISOString()
        }
        this.bookingHistory.push(newBooking)
      }
    },
    
    /**
     * 從歷史記錄中移除預約
     */
    removeBookingFromHistory(index: number) {
      if (index >= 0 && index < this.bookingHistory.length) {
        this.bookingHistory.splice(index, 1)
      }
    },
    
    /**
     * 清空購物車（清除所有預約歷史）
     */
    clearCart() {
      this.bookingHistory = []
    },
    
    // ========== 編輯模式操作 ==========
    
    /**
     * 設定編輯項目索引
     */
    setEditingItemIndex(index: number | null) {
      this.editingItemIndex = index
    },
    
    /**
     * 清除編輯項目索引
     */
    clearEditingItemIndex() {
      this.editingItemIndex = null
    },
    
    // ========== 狀態管理操作 ==========
    
    /**
     * 重置表單相關狀態
     */
    resetForm() {
      this.currentBooking = createEmptyBookingItem()
      this.selectedServiceId = null
      this.selectedServiceIds = []
    },
    
    /**
     * 清除所有狀態
     */
    clear() {
      this.selectedServiceId = null
      this.selectedStaffId = null
      this.bookingData = null
      this.bookingItems = []
      this.clearFormData()
    },
    
    /**
     * 重置所有狀態（用於新增項目）
     */
    resetAllState() {
      console.log('=== 重置所有狀態 ===')
      this.selectedServiceId = null
      this.selectedStaffId = null
      this.editingItemIndex = null
      this.clearFormData()
      console.log('✅ 所有狀態已重置')
    },
    
    // ========== 工具方法 ==========
    
    /**
     * 格式化日期字串
     * @deprecated 使用 utils/date.ts 中的 formatISODate
     */
    formatDateString(dateInput: string | Date): string {
      return formatISODate(dateInput)
    },
    
    /**
     * 恢復頁面狀態（處理頁面重新整理）
     */
    restorePageState() {
      console.log('=== 恢復頁面狀態 ===')
      
      // 修正日期格式
      if (this.formData.date) {
        const formattedDate = formatISODate(this.formData.date)
        if (formattedDate !== this.formData.date) {
          this.formData.date = formattedDate
          console.log('✅ 日期格式已修正:', formattedDate)
        }
      }
      
      // 恢復服務選擇狀態
      if (!this.selectedServiceId && this.formData.serviceId) {
        this.selectedServiceId = this.formData.serviceId
        console.log('✅ 已恢復 selectedServiceId:', this.selectedServiceId)
      }
      
      // 恢復服務人員選擇狀態
      if (!this.selectedStaffId && this.formData.selectedStaffId) {
        this.selectedStaffId = this.formData.selectedStaffId
        console.log('✅ 已恢復 selectedStaffId:', this.selectedStaffId)
      }
      
      console.log('=== 狀態恢復完成 ===')
    },
    
    // ========== 舊版方法（待移除） ==========
    
    addBookingItem(item: BookingData) {
      this.bookingItems.push(item)
    },
    
    removeBookingItem(index: number) {
      this.bookingItems.splice(index, 1)
    }
  },
  
  persist: {
    key: STORAGE_KEYS.BOOKING_STORE,
    storage: localStorage
  }
}) 
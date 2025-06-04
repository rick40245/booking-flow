import { defineStore } from 'pinia'
import type { Service } from './servicesStore'

export interface UserInfo {
  name: string
  phone: string
  email: string
}

export interface ExtraPerson {
  name: string
  phone: string
  email: string
}

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

export interface BookingData extends BookingFormData {
  id?: string
  status?: 'pending' | 'confirmed' | 'cancelled'
  createdAt?: string
}

export interface BookingItem {
  serviceId: number | null
  date: string | null
  slot: string | null
  primaryUser: UserInfo
  extraUsers: UserInfo[]
}

export const useBookingStore = defineStore('booking', {
  state: () => ({
    cart: [] as BookingItem[],
    currentBooking: {
      serviceId: null,
      date: null,
      slot: null,
      primaryUser: {
        name: '',
        phone: '',
        email: ''
      },
      extraUsers: []
    } as BookingItem,
    selectedServiceId: null as number | null,
    selectedStaffId: null as number | null,
    selectedServiceIds: [] as number[],
    bookingData: null as any,
    bookingItems: [] as any[],
    formData: {
      totalPeople: 1,
      date: '',
      timeSlot: '',
      name: '',
      phone: '',
      email: '',
      extraPersons: [],
      selectedStaffId: undefined
    } as BookingFormData,
    bookingHistory: [] as BookingData[],
    editingItemIndex: null as number | null
  }),
  getters: {
    hasUnfinishedForm(state) {
      return !!(state.currentBooking.serviceId || state.currentBooking.date || state.currentBooking.slot || state.currentBooking.primaryUser.name || state.currentBooking.primaryUser.phone || state.currentBooking.primaryUser.email || (state.currentBooking.extraUsers && state.currentBooking.extraUsers.length > 0))
    },
    hasFormData(state) {
      return !!(state.formData.name || state.formData.phone || state.formData.email || state.formData.date || state.formData.timeSlot || state.formData.extraPersons.length > 0)
    },
    isEditMode(state) {
      return state.editingItemIndex !== null
    }
  },
  actions: {
    addToCart(service: Service) {
      this.currentBooking.serviceId = service.id
      this.cart.push({ ...this.currentBooking })
      this.resetCurrentBooking()
    },
    updateCurrentBooking(data: Partial<BookingItem>) {
      this.currentBooking = { ...this.currentBooking, ...data }
    },
    resetCurrentBooking() {
      this.currentBooking = {
        serviceId: null,
        date: null,
        slot: null,
        primaryUser: {
          name: '',
          phone: '',
          email: ''
        },
        extraUsers: []
      }
    },
    removeFromCart(index: number) {
      this.cart.splice(index, 1)
    },
    editBooking(index: number) {
      this.currentBooking = { ...this.cart[index] }
      this.cart.splice(index, 1)
    },
    calculateTotal() {
      return this.cart.reduce((total, item) => {
        return total
      }, 0)
    },
    submitBooking() {
      this.cart = []
      return true
    },
    toggleServiceSelection(serviceId: number) {
      const idx = this.selectedServiceIds.indexOf(serviceId)
      if (idx === -1) {
        this.selectedServiceIds.push(serviceId)
      } else {
        this.selectedServiceIds.splice(idx, 1)
      }
    },
    resetForm() {
      this.currentBooking = {
        serviceId: null,
        date: null,
        slot: null,
        primaryUser: {
          name: '',
          phone: '',
          email: ''
        },
        extraUsers: []
      }
      this.selectedServiceId = null
      this.selectedServiceIds = []
    },
    setSelectedService(serviceId: number) {
      this.selectedServiceId = serviceId
      // 同步更新 formData 中的 serviceId
      this.formData.serviceId = serviceId
      
      // 只在非編輯模式下清除選中的服務人員
      if (this.editingItemIndex === null) {
        this.selectedStaffId = null
        this.formData.selectedStaffId = undefined
        this.formData.timeSlot = ''
      }
    },
    setSelectedStaff(staffId: number) {
      this.selectedStaffId = staffId
      this.formData.selectedStaffId = staffId
      this.formData.timeSlot = ''
    },
    setBookingData(data: BookingFormData) {
      this.formData = { ...data }
    },
    addBookingItem(item: any) {
      this.bookingItems.push(item)
    },
    removeBookingItem(index: number) {
      this.bookingItems.splice(index, 1)
    },
    updateFormData(data: Partial<BookingFormData>) {
      this.formData = { ...this.formData, ...data }
      
      // 如果更新了 selectedStaffId，同步到 selectedStaffId
      if (data.selectedStaffId !== undefined) {
        this.selectedStaffId = data.selectedStaffId || null
      }
      
      // 確保 serviceId 與 selectedServiceId 保持同步
      if (this.selectedServiceId && !this.formData.serviceId) {
        this.formData.serviceId = this.selectedServiceId
      }
    },
    clearFormData() {
      this.formData = {
        totalPeople: 1,
        date: '',
        timeSlot: '',
        name: '',
        phone: '',
        email: '',
        extraPersons: [],
        selectedStaffId: undefined
      }
    },
    clear() {
      this.selectedServiceId = null
      this.selectedStaffId = null
      this.bookingData = null
      this.bookingItems = []
      this.clearFormData()
    },
    addBooking(booking: BookingData) {
      if (this.editingItemIndex !== null) {
        this.bookingHistory[this.editingItemIndex] = {
          ...booking,
          id: this.bookingHistory[this.editingItemIndex].id,
          status: this.bookingHistory[this.editingItemIndex].status,
          createdAt: this.bookingHistory[this.editingItemIndex].createdAt
        }
        this.editingItemIndex = null
      } else {
        const newBooking = {
          ...booking,
          id: Date.now().toString(),
          status: 'pending' as const,
          createdAt: new Date().toISOString()
        }
        this.bookingHistory.push(newBooking)
      }
    },
    setEditingItemIndex(index: number | null) {
      this.editingItemIndex = index
    },
    clearEditingItemIndex() {
      this.editingItemIndex = null
    },
    removeBookingFromHistory(index: number) {
      if (index >= 0 && index < this.bookingHistory.length) {
        this.bookingHistory.splice(index, 1)
      }
    },
    clearCart() {
      this.bookingHistory = []
    },
    formatDateString(dateInput: string | Date): string {
      if (!dateInput) return ''
      
      try {
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
        if (isNaN(date.getTime())) return ''
        
        return date.toISOString().split('T')[0]
      } catch (error) {
        console.error('日期格式化錯誤:', error)
        return ''
      }
    },
    restorePageState() {
      console.log('=== 恢復頁面狀態 ===')
      
      if (this.formData.date) {
        const formattedDate = this.formatDateString(this.formData.date)
        if (formattedDate !== this.formData.date) {
          this.formData.date = formattedDate
          console.log('✅ 日期格式已修正:', formattedDate)
        }
      }
      
      if (!this.selectedServiceId && this.formData.serviceId) {
        this.selectedServiceId = this.formData.serviceId
        console.log('✅ 已恢復 selectedServiceId:', this.selectedServiceId)
      }
      
      if (!this.selectedStaffId && this.formData.selectedStaffId) {
        this.selectedStaffId = this.formData.selectedStaffId
        console.log('✅ 已恢復 selectedStaffId:', this.selectedStaffId)
      }
      
      console.log('=== 狀態恢復完成 ===')
    },
    // 新增：完全重置所有狀態（用於新增項目）
    resetAllState() {
      console.log('=== 重置所有狀態 ===')
      this.selectedServiceId = null
      this.selectedStaffId = null
      this.editingItemIndex = null
      this.clearFormData()
      console.log('✅ 所有狀態已重置')
    }
  },
  persist: {
    key: 'booking-store',
    storage: localStorage
  }
}) 
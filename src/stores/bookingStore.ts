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
    bookingHistory: [] as BookingData[]
  }),
  getters: {
    hasUnfinishedForm(state) {
      return !!(state.currentBooking.serviceId || state.currentBooking.date || state.currentBooking.slot || state.currentBooking.primaryUser.name || state.currentBooking.primaryUser.phone || state.currentBooking.primaryUser.email || (state.currentBooking.extraUsers && state.currentBooking.extraUsers.length > 0))
    },
    hasFormData(state) {
      return !!(state.formData.name || state.formData.phone || state.formData.email || state.formData.date || state.formData.timeSlot || state.formData.extraPersons.length > 0)
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
      this.selectedStaffId = null
      this.formData.selectedStaffId = undefined
      this.formData.timeSlot = ''
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
      const newBooking = {
        ...booking,
        id: Date.now().toString(),
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      }
      this.bookingHistory.push(newBooking)
    }
  },
  persist: {
    key: 'booking-store',
    storage: localStorage
  }
}) 
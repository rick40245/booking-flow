import { defineStore } from 'pinia'
import type { Service } from './servicesStore'
import {
  BOOKING_STATUS,
  DEFAULT_FORM_VALUES,
  STORAGE_KEYS,
  type BookingStatus,
} from '@/constants/booking'
import { formatISODate } from '@/utils/date'

/**
 * User Information Interface
 */
export interface UserInfo {
  name: string
  phone: string
  email: string
}

/**
 * Extra Booker Interface
 */
export interface ExtraPerson {
  name: string
  phone: string
  email: string
}

/**
 * Booking Form Data Interface
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
 * Booking Data Interface (includes status and timestamp)
 */
export interface BookingData extends BookingFormData {
  id?: string
  status?: BookingStatus
  createdAt?: string
}

/**
 * Create Empty Booking Form Data
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
    selectedStaffId: undefined,
  }
}

/**
 * Booking Store
 * Manages all booking-related state and operations.
 */
export const useBookingStore = defineStore('booking', {
  state: () => ({
    // Service selection state
    selectedServiceId: null as number | null,
    // selectedStaffId: null as number | null, // Removed, use formData.selectedStaffId
    selectedServiceIds: [] as number[],

    // Form data
    formData: createEmptyFormData(),

    // Booking history
    bookingHistory: [] as BookingData[],

    // Edit state
    editingItemIndex: null as number | null,
  }),

  getters: {
    /**
     * Check if there is form data
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
     * Is it in edit mode?
     */
    isEditMode(state): boolean {
      return state.editingItemIndex !== null
    },

    /**
     * Get the currently editing item
     */
    editingItem(state): BookingData | null {
      if (state.editingItemIndex === null) return null
      return state.bookingHistory[state.editingItemIndex] || null
    },
  },

  actions: {
    // ========== Service Selection Actions ==========

    /**
     * Toggle service selection status
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
     * Set the selected service
     */
    setSelectedService(serviceId: number) {
      this.selectedServiceId = serviceId
      this.formData.serviceId = serviceId

      // Only clear selected service staff when not in edit mode
      if (!this.isEditMode) {
        // this.selectedStaffId = null // Removed
        this.formData.selectedStaffId = undefined
        this.formData.timeSlot = ''
      }
    },

    /**
     * Set the selected service staff
     */
    setSelectedStaff(staffId: number) {
      // this.selectedStaffId = staffId // Removed
      this.formData.selectedStaffId = staffId
      this.formData.timeSlot = '' // Clear time slot when changing service staff
    },

    // ========== Form Data Actions ==========

    /**
     * Set booking data
     */
    setBookingData(data: BookingFormData) {
      this.formData = { ...data }
    },

    /**
     * Update form data
     */
    updateFormData(data: Partial<BookingFormData>) {
      this.formData = { ...this.formData, ...data }

      // Ensure serviceId and selectedServiceId remain synchronized
      if (this.selectedServiceId && !this.formData.serviceId) {
        this.formData.serviceId = this.selectedServiceId
      }
    },

    /**
     * Clear form data
     */
    clearFormData() {
      this.formData = createEmptyFormData()
    },

    // ========== Booking History Actions ==========

    /**
     * Add or update a booking
     */
    addBooking(booking: BookingData) {
      if (this.isEditMode && this.editingItemIndex !== null) {
        // Edit mode: Update existing booking
        const existingBooking = this.bookingHistory[this.editingItemIndex]
        this.bookingHistory[this.editingItemIndex] = {
          ...booking,
          id: existingBooking.id,
          status: existingBooking.status,
          createdAt: existingBooking.createdAt,
        }
        this.clearEditingItemIndex()
      } else {
        // Add mode: Create new booking
        const newBooking: BookingData = {
          ...booking,
          id: Date.now().toString(),
          status: BOOKING_STATUS.PENDING,
          createdAt: new Date().toISOString(),
        }
        this.bookingHistory.push(newBooking)
      }
    },

    /**
     * Remove booking from history
     */
    removeBookingFromHistory(index: number) {
      if (index >= 0 && index < this.bookingHistory.length) {
        this.bookingHistory.splice(index, 1)
      }
    },

    /**
     * Clear all booking history
     */
    clearBookingHistory() {
      this.bookingHistory = []
    },

    // ========== Edit Mode Actions ==========

    /**
     * Set editing item index
     */
    setEditingItemIndex(index: number | null) {
      this.editingItemIndex = index
    },

    /**
     * Clear editing item index
     */
    clearEditingItemIndex() {
      this.editingItemIndex = null
    },

    // ========== State Management Actions ==========

    /**
     * Reset form-related state
     */
    resetForm() {
      // this.currentBooking = createEmptyBookingItem() // Removed
      this.selectedServiceId = null
      this.selectedServiceIds = []
    },

    /**
     * Clear all state
     */
    clear() {
      this.selectedServiceId = null
      // this.selectedStaffId = null // Removed
      // this.bookingData = null // Removed
      // this.bookingItems = [] // Removed
      this.clearFormData()
    },

    /**
     * Reset all state (used for adding a new item)
     */
    resetAllState() {
      this.selectedServiceId = null
      // this.selectedStaffId = null // Removed
      this.editingItemIndex = null
      this.clearFormData()
    },

    // ========== Utility Methods ==========

    /**
     * Restore page state (handles page refresh)
     */
    restorePageState() {
      // Correct date format
      if (this.formData.date) {
        const formattedDate = formatISODate(this.formData.date)
        if (formattedDate !== this.formData.date) {
          this.formData.date = formattedDate
        }
      }

      // Restore service selection state
      if (!this.selectedServiceId && this.formData.serviceId) {
        this.selectedServiceId = this.formData.serviceId
      }

      // Restore service staff selection state
      // if (!this.selectedStaffId && this.formData.selectedStaffId) { // Removed
      //   this.selectedStaffId = this.formData.selectedStaffId
      // }
    },

    // ========== Legacy Methods (to be removed) ==========
    // addBookingItem and removeBookingItem were already removed conceptually by removing bookingItems
  },

  persist: {
    key: STORAGE_KEYS.BOOKING_STORE,
    storage: localStorage,
  },
})

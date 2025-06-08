/**
 * TypeScript type definitions related to the booking system.
 * Centralizes all interfaces and types used in the booking process.
 */

/**
 * Basic user information interface.
 */
export interface UserInfo {
  name: string
  phone: string
  email: string
}

/**
 * Extra booker interface.
 * Inherits from UserInfo, currently identical to UserInfo, but retained for future expansion of extra booker-specific fields.
 */
export interface ExtraPerson extends UserInfo {
  /** Special requests or notes for the extra booker. */
  specialRequests?: string
}

/**
 * Booking form data interface.
 */
export interface BookingFormData {
  /** Total number of people for the booking. */
  totalPeople: number
  /** Booking date (YYYY-MM-DD). */
  date: string
  /** Booking time slot (HH:mm). */
  timeSlot: string
  /** Name of the main booker. */
  name: string
  /** Phone number of the main booker. */
  phone: string
  /** Email of the main booker. */
  email: string
  /** List of extra bookers. */
  extraPersons: ExtraPerson[]
  /** Service item ID. */
  serviceId?: number
  /** Selected service staff ID. */
  selectedStaffId?: number
}

/**
 * Booking status type.
 */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

/**
 * Complete booking data interface (including system information).
 */
export interface BookingData extends BookingFormData {
  /** Unique identifier for the booking. */
  id?: string
  /** Booking status. */
  status?: BookingStatus
  /** Creation time (ISO 8601). */
  createdAt?: string
  /** Update time (ISO 8601). */
  updatedAt?: string
}

/**
 * Booking item interface (legacy, to be deprecated).
 * @deprecated Use BookingData instead.
 */
export interface BookingItem {
  serviceId: number | null
  date: string | null
  slot: string | null
  primaryUser: UserInfo
  extraUsers: UserInfo[]
}

/**
 * Booking display information interface (for list presentation).
 */
export interface BookingDisplayInfo extends BookingData {
  /** Original index (for editing). */
  originalIndex: number
  /** Service name. */
  serviceName: string
  /** Staff member name. */
  staffName: string
  /** Price. */
  price: number
  /** Formatted date and time. */
  formattedDateTime: string
  /** Display text for the main booker. */
  mainPersonDisplay: string
  /** Array of display text for extra bookers. */
  extraPersonsDisplay: string[]
}

/**
 * Booking validation result interface.
 */
export interface BookingValidationResult {
  /** Whether the validation is valid. */
  isValid: boolean
  /** Error message. */
  errorMessage?: string
  /** Field with the error. */
  errorField?: keyof BookingFormData
}

/**
 * Booking statistics interface.
 */
export interface BookingStatistics {
  /** Total number of bookings. */
  totalBookings: number
  /** Number of pending bookings. */
  pendingBookings: number
  /** Number of confirmed bookings. */
  confirmedBookings: number
  /** Number of cancelled bookings. */
  cancelledBookings: number
  /** Total amount. */
  totalAmount: number
}

/**
 * Booking filter criteria interface.
 */
export interface BookingFilterCriteria {
  /** Filter by status. */
  status?: BookingStatus
  /** Date range - start date. */
  startDate?: string
  /** Date range - end date. */
  endDate?: string
  /** Service item ID. */
  serviceId?: number
  /** Staff member ID. */
  staffId?: number
  /** Search keyword (name, phone). */
  keyword?: string
}

/**
 * Booking sort options.
 */
export type BookingSortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'status'

/**
 * Booking list query parameters interface.
 */
export interface BookingQueryParams {
  /** Filter criteria. */
  filters?: BookingFilterCriteria
  /** Sort options. */
  sortBy?: BookingSortOption
  /** Page number (starting from 1). */
  page?: number
  /** Number of items per page. */
  pageSize?: number
}

/**
 * Booking list response interface.
 */
export interface BookingListResponse {
  /** Array of booking data. */
  items: BookingData[]
  /** Total number of items. */
  total: number
  /** Current page number. */
  page: number
  /** Number of items per page. */
  pageSize: number
  /** Total number of pages. */
  totalPages: number
}

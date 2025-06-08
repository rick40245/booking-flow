/**
 * TypeScript type definitions related to the service system.
 * Centralizes all interfaces and types related to services and staff.
 */

/**
 * Basic staff member information interface.
 */
export interface Staff {
  /** Staff member ID. */
  id: number
  /** Staff member name. */
  name: string
  /** Service price (per hour). */
  price: number
  /** Work time description. */
  workTime: string
  /** Array of available time slots. */
  availableSlots: string[]
  /** Array of unavailable time slots (e.g., lunch break). */
  unavailableSlots?: string[]
  /** Staff member photo URL. */
  avatar?: string
  /** Staff member description. */
  description?: string
  /** Rating (1-5). */
  rating?: number
  /** Number of services provided. */
  serviceCount?: number
}

/**
 * Service item interface.
 */
export interface Service {
  /** Service ID. */
  id: number
  /** Service name. */
  name: string
  /** Service type identifier. */
  serviceType: string
  /** Array of staff IDs providing this service. */
  staffIds: number[]
  /** Service description. */
  description?: string
  /** Service duration (in minutes). */
  duration?: number
  /** Service image URL. */
  imageUrl?: string
  /** Whether the service is active. */
  isActive?: boolean
}

/**
 * Service type enum.
 */
export enum ServiceType {
  FACIAL = 'facial',
  MASSAGE = 'massage',
  STYLING = 'styling',
}

/**
 * Service type information interface.
 */
export interface ServiceTypeInfo {
  /** Type identifier. */
  type: ServiceType | string
  /** Type name. */
  name: string
  /** Type description. */
  description?: string
  /** Icon name or URL. */
  icon?: string
}

/**
 * Staff display information interface (for page display).
 */
export interface StaffDisplayInfo {
  /** Service item ID. */
  serviceId: number
  /** Staff member ID. */
  staffId: number
  /** Staff member name. */
  staffName: string
  /** Work time. */
  workTime: string
  /** Price. */
  price: number
  /** Available time slots. */
  availableSlots: string[]
}

/**
 * Service statistics interface.
 */
export interface ServiceStatistics {
  /** Service ID. */
  serviceId: number
  /** Total number of bookings. */
  totalBookings: number
  /** Total revenue. */
  totalRevenue: number
  /** Average rating. */
  averageRating: number
  /** Cancellation rate. */
  cancellationRate: number
}

/**
 * Staff statistics interface.
 */
export interface StaffStatistics {
  /** Staff member ID. */
  staffId: number
  /** Total number of services provided. */
  totalServices: number
  /** Total revenue. */
  totalRevenue: number
  /** Average rating. */
  averageRating: number
  /** Booking satisfaction rate. */
  satisfactionRate: number
  /** Number of services provided this month. */
  monthlyServices: number
}

/**
 * Slot availability interface.
 */
export interface SlotAvailability {
  /** Time slot. */
  slot: string
  /** Whether it is available. */
  isAvailable: boolean
  /** Reason for unavailability. */
  unavailableReason?: 'booked' | 'break' | 'off-work' | 'holiday'
}

/**
 * Staff schedule interface.
 */
export interface StaffSchedule {
  /** Staff member ID. */
  staffId: number
  /** Date (YYYY-MM-DD). */
  date: string
  /** Whether it is a working day. */
  isWorkingDay: boolean
  /** Working time slots. */
  workingSlots?: string[]
  /** Break time slots. */
  breakSlots?: string[]
  /** Booked time slots. */
  bookedSlots?: string[]
}

/**
 * Service price rule interface.
 */
export interface PriceRule {
  /** Rule ID. */
  id: number
  /** Service ID. */
  serviceId: number
  /** Rule type. */
  type: 'weekday' | 'weekend' | 'holiday' | 'member' | 'promotion'
  /** Price adjustment (can be a fixed amount or percentage). */
  adjustment: number
  /** Whether it is a percentage. */
  isPercentage: boolean
  /** Effective start date. */
  startDate?: string
  /** Effective end date. */
  endDate?: string
  /** Rule description. */
  description?: string
}

/**
 * Service package interface.
 */
export interface ServicePackage {
  /** Package ID. */
  id: number
  /** Package name. */
  name: string
  /** Array of included service IDs. */
  serviceIds: number[]
  /** Package price. */
  price: number
  /** Original price (for displaying discount). */
  originalPrice: number
  /** Package description. */
  description?: string
  /** Validity period (in days). */
  validityDays?: number
  /** Whether it is active. */
  isActive: boolean
}

/**
 * Service category interface.
 */
export interface ServiceCategory {
  /** Category ID. */
  id: number
  /** Category name. */
  name: string
  /** Parent category ID. */
  parentId?: number
  /** Sort order. */
  sortOrder: number
  /** Category description. */
  description?: string
  /** Whether it is visible. */
  isVisible: boolean
}

/**
 * Service search parameters interface.
 */
export interface ServiceSearchParams {
  /** Keyword. */
  keyword?: string
  /** Service type. */
  serviceType?: string
  /** Price range - minimum price. */
  minPrice?: number
  /** Price range - maximum price. */
  maxPrice?: number
  /** Available date. */
  availableDate?: string
  /** Available time slot. */
  availableSlot?: string
  /** Staff member ID. */
  staffId?: number
  /** Category ID. */
  categoryId?: number
}

/**
 * Service review interface.
 */
export interface ServiceReview {
  /** Review ID. */
  id: number
  /** Booking ID. */
  bookingId: string
  /** Service ID. */
  serviceId: number
  /** Staff member ID. */
  staffId: number
  /** Rating (1-5). */
  rating: number
  /** Review content. */
  comment?: string
  /** Reviewer name. */
  reviewerName: string
  /** Review time. */
  createdAt: string
  /** Whether it is verified. */
  isVerified: boolean
}

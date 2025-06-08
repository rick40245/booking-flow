import { defineStore } from 'pinia'
import { filterAvailableSlots } from '@/utils/date'

/**
 * Staff Member Interface
 */
export interface Staff {
  id: number
  name: string
  price: number
  workTime: string
  availableSlots: string[]
  unavailableSlots?: string[]
}

/**
 * Service Item Interface
 */
export interface Service {
  id: number
  name: string
  serviceType: string
  staffIds: number[]
}

/**
 * Staff Display Information Interface (for page display)
 */
export interface StaffDisplayInfo {
  serviceId: number
  staffId: number
  staffName: string
  workTime: string
  price: number
  availableSlots: string[]
}

/**
 * Service and Staff Management Store
 * Manages all service items and staff member data.
 */
export const useServiceStore = defineStore('service', {
  state: () => ({
    /**
     * Staff Member List
     * TODO: Should be fetched from API in the future
     */
    staffMembers: [
      {
        id: 1,
        name: '張美容師',
        price: 1000,
        workTime: '9:00-18:00',
        availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        unavailableSlots: ['12:00', '13:00'], // Lunch break
      },
      {
        id: 2,
        name: '陳美容師',
        price: 1200,
        workTime: '10:00-19:00',
        availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        unavailableSlots: ['12:00', '13:00'], // Lunch break
      },
      {
        id: 3,
        name: '李按摩師',
        price: 1300,
        workTime: '10:00-20:00',
        availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        unavailableSlots: ['12:00', '13:00'], // Lunch break
      },
      {
        id: 4,
        name: '王造型師',
        price: 1500,
        workTime: '11:00-19:00',
        availableSlots: ['11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        unavailableSlots: ['13:00'], // Lunch break
      },
      {
        id: 5,
        name: '林造型師',
        price: 1800,
        workTime: '9:00-17:00',
        availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        unavailableSlots: ['12:00', '13:00'], // Lunch break
      },
    ] as Staff[],

    /**
     * Service Item List
     * TODO: Should be fetched from API in the future
     */
    services: [
      {
        id: 1,
        name: '臉部護理',
        serviceType: 'facial',
        staffIds: [1, 2], // Beautician Zhang, Beautician Chen
      },
      {
        id: 2,
        name: '按摩',
        serviceType: 'massage',
        staffIds: [3], // Masseur Li
      },
      {
        id: 3,
        name: '造型設計',
        serviceType: 'styling',
        staffIds: [4, 5], // Stylist Wang, Stylist Lin
      },
    ] as Service[],
  }),

  getters: {
    /**
     * Get all service types
     */
    serviceTypes(state): string[] {
      return [...new Set(state.services.map((s) => s.serviceType))]
    },

    /**
     * Get total number of staff members
     */
    totalStaffCount(state): number {
      return state.staffMembers.length
    },

    /**
     * Get total number of service items
     */
    totalServiceCount(state): number {
      return state.services.length
    },
  },

  actions: {
    /**
     * Fetch service list from API
     * TODO: Implement API call
     */
    async fetchServices(): Promise<Service[]> {
      // Simulate API call
      return Promise.resolve(this.services)
    },

    /**
     * Get service item by ID
     * @param id - Service ID
     * @returns Service item or undefined
     */
    getServiceById(id: number): Service | undefined {
      return this.services.find((service) => service.id === id)
    },

    /**
     * Get staff member by ID
     * @param id - Staff ID
     * @returns Staff member or undefined
     */
    getStaffById(id: number): Staff | undefined {
      return this.staffMembers.find((staff) => staff.id === id)
    },

    /**
     * Get staff list by service type (includes extended information)
     * @param serviceType - Service type
     * @returns Array of staff display information
     */
    getStaffByServiceType(serviceType: string): (StaffDisplayInfo | null)[] {
      const service = this.services.find((s) => s.serviceType === serviceType)
      if (!service) return []

      return service.staffIds
        .map((staffId) => {
          const staff = this.getStaffById(staffId)
          if (!staff) return null

          return {
            serviceId: service.id,
            staffId: staff.id,
            staffName: staff.name,
            workTime: staff.workTime,
            price: staff.price,
            availableSlots: staff.availableSlots,
          }
        })
        .filter(Boolean)
    },

    /**
     * Get service type by service ID
     * @param serviceId - Service ID
     * @returns Service type or null
     */
    getServiceTypeById(serviceId: number): string | null {
      const service = this.getServiceById(serviceId)
      return service?.serviceType || null
    },

    /**
     * Get staff list by service ID
     * @param serviceId - Service ID
     * @returns Array of staff members
     */
    getStaffByServiceId(serviceId: number): Staff[] {
      const service = this.getServiceById(serviceId)
      if (!service) return []

      return service.staffIds
        .map((staffId) => this.getStaffById(staffId))
        .filter((staff): staff is Staff => staff !== undefined)
    },

    /**
     * Get available time slots for a staff member
     * @param staffId - Staff ID
     * @param date - Selected date (optional)
     * @returns Array of available time slots
     */
    getAvailableSlots(staffId: number, date?: string): string[] {
      const staff = this.getStaffById(staffId)
      if (!staff) return []

      const slots = staff.availableSlots || []

      // If a date is specified, filter out past time slots
      if (date) {
        return filterAvailableSlots(slots, date)
      }

      return slots
    },

    /**
     * Check if a specific time slot is available
     * @param staffId - Staff ID
     * @param date - Date
     * @param slot - Time slot
     * @returns True if available, false otherwise
     */
    isSlotAvailable(staffId: number, date: string, slot: string): boolean {
      const availableSlots = this.getAvailableSlots(staffId, date)
      return availableSlots.includes(slot)
    },

    /**
     * Get the price range for a service
     * @param serviceId - Service ID
     * @returns Price range object { min, max } or null
     */
    getServicePriceRange(serviceId: number): { min: number; max: number } | null {
      const staffList = this.getStaffByServiceId(serviceId)
      if (staffList.length === 0) return null

      const prices = staffList.map((staff) => staff.price)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      }
    },
  },
})

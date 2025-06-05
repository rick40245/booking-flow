import { defineStore } from 'pinia'
import { filterAvailableSlots } from '@/utils/date'

/**
 * 服務人員介面
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
 * 服務項目介面
 */
export interface Service {
  id: number
  name: string
  serviceType: string
  staffIds: number[]
}

/**
 * 服務人員擴展資訊介面（用於頁面顯示）
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
 * 服務與人員管理 Store
 * 管理所有服務項目和服務人員的資料
 */
export const useServiceStore = defineStore('service', {
  state: () => ({
    /**
     * 服務人員列表
     * TODO: 未來應從 API 取得
     */
    staffMembers: [
      {
        id: 1,
        name: '張美容師',
        price: 1000,
        workTime: '9:00-18:00',
        availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        unavailableSlots: ['12:00', '13:00'] // 午休時間
      },
      {
        id: 2,
        name: '陳美容師',
        price: 1200,
        workTime: '10:00-19:00',
        availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        unavailableSlots: ['12:00', '13:00'] // 午休時間
      },
      {
        id: 3,
        name: '李按摩師',
        price: 1300,
        workTime: '10:00-20:00',
        availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        unavailableSlots: ['12:00', '13:00'] // 午休時間
      },
      {
        id: 4,
        name: '王造型師',
        price: 1500,
        workTime: '11:00-19:00',
        availableSlots: ['11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        unavailableSlots: ['13:00'] // 午休時間
      },
      {
        id: 5,
        name: '林造型師',
        price: 1800,
        workTime: '9:00-17:00',
        availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        unavailableSlots: ['12:00', '13:00'] // 午休時間
      }
    ] as Staff[],
    
    /**
     * 服務項目列表
     * TODO: 未來應從 API 取得
     */
    services: [
      { 
        id: 1, 
        name: '臉部護理', 
        serviceType: 'facial',
        staffIds: [1, 2] // 張美容師、陳美容師
      },
      { 
        id: 2, 
        name: '按摩', 
        serviceType: 'massage',
        staffIds: [3] // 李按摩師
      },
      { 
        id: 3, 
        name: '造型設計', 
        serviceType: 'styling',
        staffIds: [4, 5] // 王造型師、林造型師
      }
    ] as Service[]
  }),

  getters: {
    /**
     * 取得所有服務類型
     */
    serviceTypes(state): string[] {
      return [...new Set(state.services.map(s => s.serviceType))]
    },
    
    /**
     * 取得所有服務人員數量
     */
    totalStaffCount(state): number {
      return state.staffMembers.length
    },
    
    /**
     * 取得所有服務項目數量
     */
    totalServiceCount(state): number {
      return state.services.length
    }
  },

  actions: {
    /**
     * 從 API 取得服務列表
     * TODO: 實作 API 呼叫
     */
    async fetchServices(): Promise<Service[]> {
      // 模擬 API 呼叫
      return Promise.resolve(this.services)
    },

    /**
     * 根據 ID 取得服務項目
     * @param id - 服務 ID
     * @returns 服務項目或 undefined
     */
    getServiceById(id: number): Service | undefined {
      return this.services.find(service => service.id === id)
    },

    /**
     * 根據 ID 取得服務人員
     * @param id - 服務人員 ID
     * @returns 服務人員或 undefined
     */
    getStaffById(id: number): Staff | undefined {
      return this.staffMembers.find(staff => staff.id === id)
    },

    /**
     * 根據服務類型取得服務人員列表（包含擴展資訊）
     * @param serviceType - 服務類型
     * @returns 服務人員擴展資訊陣列
     */
    getStaffByServiceType(serviceType: string): (StaffDisplayInfo | null)[] {
      const service = this.services.find(s => s.serviceType === serviceType)
      if (!service) return []
      
      return service.staffIds.map(staffId => {
        const staff = this.getStaffById(staffId)
        if (!staff) return null
        
        return {
          serviceId: service.id,
          staffId: staff.id,
          staffName: staff.name,
          workTime: staff.workTime,
          price: staff.price,
          availableSlots: staff.availableSlots
        }
      }).filter(Boolean)
    },

    /**
     * 根據服務 ID 取得服務類型
     * @param serviceId - 服務 ID
     * @returns 服務類型或 null
     */
    getServiceTypeById(serviceId: number): string | null {
      const service = this.getServiceById(serviceId)
      return service?.serviceType || null
    },

    /**
     * 根據服務 ID 取得服務人員列表
     * @param serviceId - 服務 ID
     * @returns 服務人員陣列
     */
    getStaffByServiceId(serviceId: number): Staff[] {
      const service = this.getServiceById(serviceId)
      if (!service) return []
      
      return service.staffIds
        .map(staffId => this.getStaffById(staffId))
        .filter((staff): staff is Staff => staff !== undefined)
    },

    /**
     * 取得服務人員的可用時段
     * @param staffId - 服務人員 ID
     * @param date - 選擇的日期（可選）
     * @returns 可用時段陣列
     */
    getAvailableSlots(staffId: number, date?: string): string[] {
      const staff = this.getStaffById(staffId)
      if (!staff) return []

      const slots = staff.availableSlots || []
      
      // 如果有指定日期，過濾已過去的時段
      if (date) {
        return filterAvailableSlots(slots, date)
      }

      return slots
    },
    
    /**
     * 檢查特定時段是否可用
     * @param staffId - 服務人員 ID
     * @param date - 日期
     * @param slot - 時段
     * @returns 是否可用
     */
    isSlotAvailable(staffId: number, date: string, slot: string): boolean {
      const availableSlots = this.getAvailableSlots(staffId, date)
      return availableSlots.includes(slot)
    },
    
    /**
     * 取得服務的價格範圍
     * @param serviceId - 服務 ID
     * @returns 價格範圍物件 { min, max }
     */
    getServicePriceRange(serviceId: number): { min: number; max: number } | null {
      const staffList = this.getStaffByServiceId(serviceId)
      if (staffList.length === 0) return null
      
      const prices = staffList.map(staff => staff.price)
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    }
  }
}) 
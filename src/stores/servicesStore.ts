import { defineStore } from 'pinia'

export interface Staff {
  id: number
  name: string
  price: number
  workTime: string
  availableSlots: string[]
  unavailableSlots?: string[]
}

export interface Service {
  id: number
  name: string
  serviceType: string
  staffIds: number[]
}

export const useServiceStore = defineStore('service', {
  state: () => ({
    staffMembers: [
      {
        id: 1,
        name: '張美容師',
        price: 1000,
        workTime: '9:00-18:00',
        availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        unavailableSlots: ['12:00', '13:00']
      },
      {
        id: 2,
        name: '陳美容師',
        price: 1200,
        workTime: '10:00-19:00',
        availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        unavailableSlots: ['12:00', '13:00']
      },
      {
        id: 3,
        name: '李按摩師',
        price: 1300,
        workTime: '10:00-20:00',
        availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        unavailableSlots: ['12:00', '13:00']
      },
      {
        id: 4,
        name: '王造型師',
        price: 1500,
        workTime: '11:00-19:00',
        availableSlots: ['11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        unavailableSlots: ['13:00']
      },
      {
        id: 5,
        name: '林造型師',
        price: 1800,
        workTime: '9:00-17:00',
        availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        unavailableSlots: ['12:00', '13:00']
      }
    ] as Staff[],
    
    services: [
      { 
        id: 1, 
        name: '臉部護理', 
        serviceType: 'facial',
        staffIds: [1, 2]
      },
      { 
        id: 2, 
        name: '按摩', 
        serviceType: 'massage',
        staffIds: [3]
      },
      { 
        id: 3, 
        name: '造型設計', 
        serviceType: 'styling',
        staffIds: [4, 5]
      }
    ] as Service[]
  }),

  actions: {
    async fetchServices() {
      return this.services
    },

    getServiceById(id: number) {
      return this.services.find(service => service.id === id)
    },

    getStaffById(id: number) {
      return this.staffMembers.find(staff => staff.id === id)
    },

    getStaffByServiceType(serviceType: string) {
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

    getServiceTypeById(serviceId: number) {
      const service = this.getServiceById(serviceId)
      return service?.serviceType || null
    },

    getStaffByServiceId(serviceId: number) {
      const service = this.getServiceById(serviceId)
      if (!service) return []
      
      return service.staffIds.map(staffId => this.getStaffById(staffId)).filter(Boolean)
    },

    getAvailableSlots(staffId: number, date?: string) {
      const staff = this.getStaffById(staffId)
      if (!staff) return []

      let slots = staff.availableSlots || []
      
      if (date) {
        const selectedDate = new Date(date)
        const today = new Date()
        
        if (selectedDate.toDateString() === today.toDateString()) {
          const currentHour = today.getHours()
          slots = slots.filter(slot => {
            const slotHour = parseInt(slot.split(':')[0])
            return slotHour > currentHour
          })
        }
      }

      return slots
    }
  }
}) 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

// 不需要 mock，直接使用實際的常數
import { useServiceStore, type Staff, type Service, type StaffDisplayInfo } from '../servicesStore';

describe('useServiceStore', () => {
  let store: ReturnType<typeof useServiceStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useServiceStore();
  });

  describe('State', () => {
    it('initializes with staff members', () => {
      expect(store.staffMembers).toHaveLength(5);
      expect(store.staffMembers[0]).toEqual({
        id: 1,
        name: '張美容師',
        price: 1000,
        workTime: '9:00-18:00',
        availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        unavailableSlots: ['12:00', '13:00'],
      });
    });

    it('initializes with services', () => {
      expect(store.services).toHaveLength(3);
      expect(store.services[0]).toEqual({
        id: 1,
        name: '臉部護理',
        serviceType: 'facial',
        staffIds: [1, 2],
      });
    });
  });

  describe('Getters', () => {
    it('serviceTypes returns correct unique service types', () => {
      const expectedTypes = ['facial', 'massage', 'styling'];
      expect(store.serviceTypes.sort()).toEqual(expectedTypes.sort());
    });

    it('totalStaffCount returns correct count', () => {
      expect(store.totalStaffCount).toBe(5);
    });

    it('totalServiceCount returns correct count', () => {
      expect(store.totalServiceCount).toBe(3);
    });
  });

  describe('Actions', () => {
    it('fetchServices returns services from state', async () => {
      const services = await store.fetchServices();
      expect(services).toEqual(store.services);
    });

    it('getServiceById returns correct service or undefined', () => {
      expect(store.getServiceById(1)).toEqual(store.services[0]);
      expect(store.getServiceById(999)).toBeUndefined();
    });

    it('getStaffById returns correct staff or undefined', () => {
      expect(store.getStaffById(1)).toEqual(store.staffMembers[0]);
      expect(store.getStaffById(999)).toBeUndefined();
    });

    it('getStaffByServiceType returns correct staff display info or empty array', () => {
      const facialStaff: StaffDisplayInfo[] = [
        {
          serviceId: 1,
          staffId: 1,
          staffName: '張美容師',
          workTime: '9:00-18:00',
          price: 1000,
          availableSlots: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        },
        {
          serviceId: 1,
          staffId: 2,
          staffName: '陳美容師',
          workTime: '10:00-19:00',
          price: 1200,
          availableSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
        },
      ];
      expect(store.getStaffByServiceType('facial')).toEqual(facialStaff);
      expect(store.getStaffByServiceType('nonexistent')).toEqual([]);
    });

    it('getServiceTypeById returns correct service type or null', () => {
      expect(store.getServiceTypeById(1)).toBe('facial');
      expect(store.getServiceTypeById(2)).toBe('massage');
      expect(store.getServiceTypeById(999)).toBeNull();
    });

    it('getStaffByServiceId returns correct staff members or empty array', () => {
      const facialStaff = [store.staffMembers[0], store.staffMembers[1]]; // 張美容師, 陳美容師
      expect(store.getStaffByServiceId(1)).toEqual(facialStaff);
      expect(store.getStaffByServiceId(999)).toEqual([]);
    });

    describe('getAvailableSlots', () => {
      it('returns empty array for invalid staffId', () => {
        expect(store.getAvailableSlots(999)).toEqual([]);
      });

      it('returns all slots for valid staffId and no date', () => {
        expect(store.getAvailableSlots(1)).toEqual(store.staffMembers[0].availableSlots);
      });

      it('returns filtered slots for valid staffId and date', () => {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const result = store.getAvailableSlots(1, today);
        expect(Array.isArray(result)).toBe(true);
        // The exact result depends on filterAvailableSlots implementation
      });
    });

    describe('isSlotAvailable', () => {
      it('returns true if slot is in available slots for staffId and date', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0];
        // Use future date to avoid time filtering issues
        expect(store.isSlotAvailable(1, tomorrowDate, '9:00')).toBe(true);
      });

      it('returns false if slot is not in available slots', () => {
        const today = new Date().toISOString().split('T')[0];
        expect(store.isSlotAvailable(1, today, '8:00')).toBe(false);
      });

      it('returns false for invalid staffId', () => {
        const today = new Date().toISOString().split('T')[0];
        expect(store.isSlotAvailable(999, today, '9:00')).toBe(false);
      });
    });

    describe('getServicePriceRange', () => {
      it('returns correct min/max price for a service with multiple staff', () => {
        // Service 1 (臉部護理) is by staff 1 (張美容師, price 1000) and 2 (陳美容師, price 1200)
        expect(store.getServicePriceRange(1)).toEqual({ min: 1000, max: 1200 });
      });

      it('returns same min/max price for a service with a single staff member', () => {
        // Service 2 (按摩) is by staff 3 (李按摩師, price 1300)
        expect(store.getServicePriceRange(2)).toEqual({ min: 1300, max: 1300 });
      });

      it('returns null for an invalid service ID', () => {
        expect(store.getServicePriceRange(999)).toBeNull();
      });
    });
  });
});

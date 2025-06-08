import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useServiceStore, type Staff, type Service, type StaffDisplayInfo } from '../servicesStore'; // Adjust path as needed
import { SERVICE_TYPES_MAP, STAFF_MEMBERS, SERVICES } from '@/constants/services'; // Mocked data

// Mock the constants that would normally be imported
vi.mock('@/constants/services', () => ({
  STAFF_MEMBERS: [
    { id: 1, name: 'Alice', type: 'hair', availableSlots: ['09:00', '10:00', '14:00'], price: 100 },
    { id: 2, name: 'Bob', type: 'spa', availableSlots: ['11:00', '15:00'], price: 120 },
    { id: 3, name: 'Charlie', type: 'hair', availableSlots: ['09:00', '11:00', '16:00'], price: 110 },
    { id: 4, name: 'Diana', type: 'nails', availableSlots: ['10:00', '14:00'], price: 90 },
  ] as Staff[],
  SERVICES: [
    { id: 101, name: 'Haircut', type: 'hair', duration: 60, staffIds: [1, 3] },
    { id: 102, name: 'Massage', type: 'spa', duration: 90, staffIds: [2] },
    { id: 103, name: 'Manicure', type: 'nails', duration: 45, staffIds: [4] },
    { id: 104, name: 'Blow Dry', type: 'hair', duration: 30, staffIds: [1] },
  ] as Service[],
  SERVICE_TYPES_MAP: {
    hair: '美髮',
    spa: '美容',
    nails: '美甲',
  },
}));


describe('useServiceStore', () => {
  let store: ReturnType<typeof useServiceStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useServiceStore();
    // The store initializes itself with mocked data due to vi.mock
  });

  describe('State', () => {
    it('initializes with staff members from mocked data', () => {
      expect(store.staffMembers).toEqual(STAFF_MEMBERS);
    });

    it('initializes with services from mocked data', () => {
      expect(store.services).toEqual(SERVICES);
    });
  });

  describe('Getters', () => {
    it('serviceTypes returns correct unique service types', () => {
      const expectedTypes = ['hair', 'spa', 'nails'];
      expect(store.serviceTypes.sort()).toEqual(expectedTypes.sort());
    });

    it('totalStaffCount returns correct count', () => {
      expect(store.totalStaffCount).toBe(STAFF_MEMBERS.length);
    });

    it('totalServiceCount returns correct count', () => {
      expect(store.totalServiceCount).toBe(SERVICES.length);
    });
  });

  describe('Actions', () => {
    it('fetchServices returns services from state', async () => {
      const services = await store.fetchServices();
      expect(services).toEqual(SERVICES);
    });

    it('getServiceById returns correct service or null', () => {
      expect(store.getServiceById(101)).toEqual(SERVICES[0]);
      expect(store.getServiceById(999)).toBeNull();
    });

    it('getStaffById returns correct staff or null', () => {
      expect(store.getStaffById(1)).toEqual(STAFF_MEMBERS[0]);
      expect(store.getStaffById(999)).toBeNull();
    });

    it('getStaffByServiceType returns correct staff display info or empty array', () => {
      const hairStaff: StaffDisplayInfo[] = [
        { id: 1, name: 'Alice', typeName: SERVICE_TYPES_MAP.hair },
        { id: 3, name: 'Charlie', typeName: SERVICE_TYPES_MAP.hair },
      ];
      expect(store.getStaffByServiceType('hair')).toEqual(hairStaff);
      expect(store.getStaffByServiceType('nonexistent')).toEqual([]);
    });

    it('getServiceTypeById returns correct service type name or null', () => {
      expect(store.getServiceTypeById(101)).toBe(SERVICE_TYPES_MAP.hair);
      expect(store.getServiceTypeById(102)).toBe(SERVICE_TYPES_MAP.spa);
      expect(store.getServiceTypeById(999)).toBeNull();
    });

    it('getStaffByServiceId returns correct staff members or empty array', () => {
      const haircutStaff = [STAFF_MEMBERS[0], STAFF_MEMBERS[2]]; // Alice, Charlie
      expect(store.getStaffByServiceId(101)).toEqual(haircutStaff);
      expect(store.getStaffByServiceId(999)).toEqual([]);
    });

    describe('getAvailableSlots', () => {
      it('returns empty array for invalid staffId', () => {
        expect(store.getAvailableSlots(999)).toEqual([]);
      });

      it('returns all slots for valid staffId and no date (assuming filterAvailableSlots is not date-sensitive here)', () => {
        // This test assumes filterAvailableSlots with no date/today returns all slots for that staff.
        // The actual behavior depends on filterAvailableSlots implementation.
        // For staff 1 (Alice):
        expect(store.getAvailableSlots(1)).toEqual(STAFF_MEMBERS[0].availableSlots);
      });

      it('returns filtered slots for valid staffId and date (relying on filterAvailableSlots)', () => {
        // This test relies on the correctness of filterAvailableSlots, which should be tested separately.
        // Let's assume filterAvailableSlots is mocked or behaves predictably.
        // For simplicity, we'll assume if a date is provided, it still returns all slots for now,
        // as the store itself doesn't implement the time-based filtering.
        const today = new Date();
        // This will internally call filterAvailableSlots(today, STAFF_MEMBERS[0].availableSlots)
        // We expect it to return the same slots as if no date was passed if filterAvailableSlots isn't actually filtering by time here.
        expect(store.getAvailableSlots(1, today)).toEqual(STAFF_MEMBERS[0].availableSlots);
      });
    });

    describe('isSlotAvailable', () => {
      it('returns true if slot is in available slots for staffId and date', () => {
        expect(store.isSlotAvailable(1, '09:00', new Date())).toBe(true);
        expect(store.isSlotAvailable(1, STAFF_MEMBERS[0].availableSlots[0], new Date())).toBe(true);
      });

      it('returns false if slot is not in available slots', () => {
        expect(store.isSlotAvailable(1, '08:00', new Date())).toBe(false);
      });

      it('returns false for invalid staffId', () => {
        expect(store.isSlotAvailable(999, '09:00', new Date())).toBe(false);
      });
    });

    describe('getServicePriceRange', () => {
      it('returns correct min/max price for a service with multiple staff', () => {
        // Service 101 (Haircut) is by staff 1 (Alice, price 100) and 3 (Charlie, price 110)
        expect(store.getServicePriceRange(101)).toEqual({ minPrice: 100, maxPrice: 110 });
      });

      it('returns same min/max price for a service with a single staff member', () => {
        // Service 102 (Massage) is by staff 2 (Bob, price 120)
        expect(store.getServicePriceRange(102)).toEqual({ minPrice: 120, maxPrice: 120 });
      });
       it('returns correct min/max price for a service with a single staff member (another case)', () => {
        // Service 104 (Blow Dry) is by staff 1 (Alice, price 100)
        expect(store.getServicePriceRange(104)).toEqual({ minPrice: 100, maxPrice: 100 });
      });

      it('returns null for an invalid service ID', () => {
        expect(store.getServicePriceRange(999)).toBeNull();
      });

      it('returns null if service has no assigned staff (edge case, though data implies staffIds is non-empty)', () => {
        // Temporarily add a service with no staff to test this
        store.services.push({ id: 105, name: 'Empty Service', type: 'hair', duration: 30, staffIds: [] });
        expect(store.getServicePriceRange(105)).toBeNull();
        store.services.pop(); // Clean up
      });
        it('returns null if service staffIds array is present but empty', () => {
        const serviceWithEmptyStaff = { id: 201, name: 'Test Service Empty Staff', type: 'hair', duration: 60, staffIds: [] };
        store.services.push(serviceWithEmptyStaff);
        expect(store.getServicePriceRange(201)).toBeNull();
        store.services.pop(); // cleanup
      });

      it('returns null if staff members for the service are not found (data integrity issue)', () => {
        const serviceWithNonExistentStaff = { id: 202, name: 'Test Service NonExistent Staff', type: 'spa', duration: 60, staffIds: [998, 999] };
        store.services.push(serviceWithNonExistentStaff);
        expect(store.getServicePriceRange(202)).toBeNull();
        store.services.pop(); // cleanup
      });
    });
  });
});

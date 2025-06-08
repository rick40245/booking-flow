import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useBookingStore, type BookingFormData, type BookingData } from '../bookingStore'; // Adjust path
import { BOOKING_STATUS, DEFAULT_FORM_VALUES } from '@/constants/booking'; // Adjust path
import { formatISODate } from '@/utils/date'; // Adjust path

// Helper to create an empty form data object, similar to the store's internal one
function createEmptyFormDataForTest(): BookingFormData {
  return {
    totalPeople: DEFAULT_FORM_VALUES.TOTAL_PEOPLE,
    date: DEFAULT_FORM_VALUES.DATE,
    timeSlot: DEFAULT_FORM_VALUES.TIME_SLOT,
    name: DEFAULT_FORM_VALUES.NAME,
    phone: DEFAULT_FORM_VALUES.PHONE,
    email: DEFAULT_FORM_VALUES.EMAIL,
    extraPersons: [],
    serviceId: undefined, // Ensure this matches createEmptyFormData in the store
    selectedStaffId: undefined,
  };
}

describe('useBookingStore (Refactored)', () => {
  let store: ReturnType<typeof useBookingStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useBookingStore();
  });

  afterEach(() => {
    vi.useRealTimers(); // Ensure timers are reset after each test if faked
  });

  describe('Initial State', () => {
    it('selectedServiceId is null', () => {
      expect(store.selectedServiceId).toBeNull();
    });

    it('formData equals createEmptyFormData()', () => {
      expect(store.formData).toEqual(createEmptyFormDataForTest());
    });

    it('bookingHistory is an empty array', () => {
      expect(store.bookingHistory).toEqual([]);
    });

    it('editingItemIndex is null', () => {
      expect(store.editingItemIndex).toBeNull();
    });

    it('selectedServiceIds is an empty array', () => {
      expect(store.selectedServiceIds).toEqual([]);
    });
  });

  describe('Getters', () => {
    describe('hasFormData', () => {
      it('returns false when form is empty', () => {
        store.formData = createEmptyFormDataForTest();
        expect(store.hasFormData).toBe(false);
      });

      it('returns true when form has some data (e.g., name)', () => {
        store.formData.name = 'Test User';
        expect(store.hasFormData).toBe(true);
      });
        it('returns true when form has extraPersons', () => {
        store.formData.extraPersons = [{name: 'Guest', phone: '', email: ''}];
        expect(store.hasFormData).toBe(true);
      });
    });

    describe('isEditMode', () => {
      it('returns false when editingItemIndex is null', () => {
        store.editingItemIndex = null;
        expect(store.isEditMode).toBe(false);
      });

      it('returns true when editingItemIndex is a number', () => {
        store.editingItemIndex = 0;
        expect(store.isEditMode).toBe(true);
      });
    });

    describe('editingItem', () => {
      const bookingItem: BookingData = { ...createEmptyFormDataForTest(), id: '1', name: 'Test Booking' };
      beforeEach(() => {
        store.bookingHistory = [bookingItem];
      });

      it('returns null when editingItemIndex is null', () => {
        store.editingItemIndex = null;
        expect(store.editingItem).toBeNull();
      });

      it('returns the correct item when editingItemIndex is valid', () => {
        store.editingItemIndex = 0;
        expect(store.editingItem).toEqual(bookingItem);
      });

      it('returns null when editingItemIndex is out of bounds (negative)', () => {
        store.editingItemIndex = -1;
        expect(store.editingItem).toBeNull(); // Or undefined based on Pinia/JS behavior for array[-1]
      });
       it('returns null when editingItemIndex is out of bounds (too large)', () => {
        store.editingItemIndex = 1; // History only has 1 item at index 0
        expect(store.editingItem).toBeNull();
      });
    });
  });

  describe('Actions', () => {
    describe('setSelectedService', () => {
      const serviceId = 123;
      it('sets selectedServiceId and formData.serviceId', () => {
        store.setSelectedService(serviceId);
        expect(store.selectedServiceId).toBe(serviceId);
        expect(store.formData.serviceId).toBe(serviceId);
      });

      it('when not in edit mode, clears formData.selectedStaffId and formData.timeSlot', () => {
        store.formData.selectedStaffId = 99;
        store.formData.timeSlot = '10:00';
        store.editingItemIndex = null; // Ensure not in edit mode
        store.setSelectedService(serviceId);
        expect(store.formData.selectedStaffId).toBeUndefined();
        expect(store.formData.timeSlot).toBe('');
      });

      it('when in edit mode, does not clear formData.selectedStaffId and timeSlot', () => {
        store.editingItemIndex = 0; // Enter edit mode
        store.formData.selectedStaffId = 99;
        store.formData.timeSlot = '10:00';
        store.setSelectedService(serviceId);
        expect(store.formData.selectedStaffId).toBe(99);
        expect(store.formData.timeSlot).toBe('10:00');
      });
    });

    describe('setSelectedStaff', () => {
      const staffId = 77;
      it('sets formData.selectedStaffId and clears formData.timeSlot', () => {
        store.formData.timeSlot = '10:00';
        store.setSelectedStaff(staffId);
        expect(store.formData.selectedStaffId).toBe(staffId);
        expect(store.formData.timeSlot).toBe('');
      });
    });

    it('setBookingData updates formData completely', () => {
      const newData: BookingFormData = {
        ...createEmptyFormDataForTest(),
        name: 'Jane Doe',
        totalPeople: 2,
      };
      store.setBookingData(newData);
      expect(store.formData).toEqual(newData);
    });

    describe('updateFormData', () => {
      it('updates formData partially', () => {
        store.formData.name = 'Old Name';
        store.updateFormData({ email: 'test@example.com' });
        expect(store.formData.name).toBe('Old Name');
        expect(store.formData.email).toBe('test@example.com');
      });

      it('synchronizes formData.serviceId from selectedServiceId if not in partialData', () => {
        store.selectedServiceId = 456;
        store.formData.serviceId = undefined; // Ensure it's not set
        store.updateFormData({ name: 'Test' }); // Update something else
        expect(store.formData.serviceId).toBe(456);
      });
       it('does not overwrite formData.serviceId if it is in partialData', () => {
        store.selectedServiceId = 456;
        store.updateFormData({ name: 'Test', serviceId: 789 });
        expect(store.formData.serviceId).toBe(789);
      });
    });

    it('clearFormData resets formData to default', () => {
      store.formData.name = 'Filled Name';
      store.clearFormData();
      expect(store.formData).toEqual(createEmptyFormDataForTest());
    });

    describe('addBooking', () => {
      const bookingPayload: BookingData = {
        ...createEmptyFormDataForTest(),
        name: 'Test User Booking',
        date: '2024-01-01',
        timeSlot: '10:00',
      };

      describe('Add Mode', () => {
        beforeEach(() => {
          vi.useFakeTimers();
          vi.setSystemTime(new Date('2024-07-25T10:00:00.000Z'));
        });

        afterEach(() => {
          vi.useRealTimers();
        });

        it('adds a new item to bookingHistory with id, status, and createdAt', () => {
          store.addBooking(bookingPayload);
          expect(store.bookingHistory.length).toBe(1);
          const addedBooking = store.bookingHistory[0];
          expect(addedBooking.name).toBe('Test User Booking');
          expect(addedBooking.id).toBeDefined();
          expect(addedBooking.id).toBe(Date.now().toString()); // Based on current implementation
          expect(addedBooking.status).toBe(BOOKING_STATUS.PENDING);
          expect(addedBooking.createdAt).toBe(new Date().toISOString());
        });
      });

      describe('Edit Mode', () => {
        const originalBooking: BookingData = {
          id: 'original-id-123',
          status: BOOKING_STATUS.CONFIRMED,
          createdAt: new Date('2023-01-01T12:00:00.000Z').toISOString(),
          ...createEmptyFormDataForTest(),
          name: 'Original Name',
          date: '2023-05-05',
        };
        const updatedData: BookingData = { // Does not need id, status, createdAt
          ...createEmptyFormDataForTest(),
          name: 'Updated Name',
          date: '2023-06-06',
        };

        beforeEach(() => {
          store.bookingHistory = [{ ...originalBooking }];
          store.editingItemIndex = 0;
        });

        it('updates the existing item in bookingHistory and resets editingItemIndex', () => {
          store.addBooking(updatedData);
          expect(store.bookingHistory.length).toBe(1);
          const editedBooking = store.bookingHistory[0];

          expect(editedBooking.name).toBe('Updated Name');
          expect(editedBooking.date).toBe('2023-06-06');
          // These should remain from the original
          expect(editedBooking.id).toBe('original-id-123');
          expect(editedBooking.status).toBe(BOOKING_STATUS.CONFIRMED);
          expect(editedBooking.createdAt).toBe(originalBooking.createdAt);

          expect(store.editingItemIndex).toBeNull();
        });
      });
    });

    describe('removeBookingFromHistory', () => {
      beforeEach(() => {
        store.bookingHistory = [
          { ...createEmptyFormDataForTest(), id: '1' },
          { ...createEmptyFormDataForTest(), id: '2' },
        ];
      });

      it('removes item at valid index', () => {
        store.removeBookingFromHistory(0);
        expect(store.bookingHistory.length).toBe(1);
        expect(store.bookingHistory[0].id).toBe('2');
      });

      it('does nothing for invalid index (negative)', () => {
        store.removeBookingFromHistory(-1);
        expect(store.bookingHistory.length).toBe(2);
      });
      it('does nothing for invalid index (out of bounds)', () => {
        store.removeBookingFromHistory(2);
        expect(store.bookingHistory.length).toBe(2);
      });
    });

    it('clearBookingHistory clears the bookingHistory array', () => {
      store.bookingHistory = [{ ...createEmptyFormDataForTest(), id: '1' }];
      store.clearBookingHistory();
      expect(store.bookingHistory).toEqual([]);
    });

    it('setEditingItemIndex sets editingItemIndex', () => {
      store.setEditingItemIndex(1);
      expect(store.editingItemIndex).toBe(1);
      store.setEditingItemIndex(null);
      expect(store.editingItemIndex).toBeNull();
    });

    it('clearEditingItemIndex sets editingItemIndex to null', () => {
      store.editingItemIndex = 1;
      store.clearEditingItemIndex();
      expect(store.editingItemIndex).toBeNull();
    });

    describe('toggleServiceSelection', () => {
      it('adds serviceId if not present', () => {
        store.toggleServiceSelection(10);
        expect(store.selectedServiceIds).toContain(10);
      });
      it('removes serviceId if present', () => {
        store.selectedServiceIds = [10, 20];
        store.toggleServiceSelection(10);
        expect(store.selectedServiceIds).not.toContain(10);
        expect(store.selectedServiceIds).toContain(20);
      });
    });

    it('clear action resets selectedServiceId and formData', () => {
      store.selectedServiceId = 1;
      store.formData.name = 'Test';
      store.clear();
      expect(store.selectedServiceId).toBeNull();
      expect(store.formData).toEqual(createEmptyFormDataForTest());
    });

    it('resetAllState resets selectedServiceId, editingItemIndex, and formData', () => {
      store.selectedServiceId = 1;
      store.editingItemIndex = 0;
      store.formData.name = 'Test';
      store.resetAllState();
      expect(store.selectedServiceId).toBeNull();
      expect(store.editingItemIndex).toBeNull();
      expect(store.formData).toEqual(createEmptyFormDataForTest());
    });

    describe('restorePageState', () => {
      it('formats formData.date using formatISODate', () => {
        const dateObj = new Date(2024, 0, 15); // Jan 15, 2024
        store.formData.date = dateObj.toString(); // Some non-ISO string
        store.restorePageState();
        expect(store.formData.date).toBe(formatISODate(dateObj));

        store.formData.date = '2023/12/25';
        store.restorePageState();
        expect(store.formData.date).toBe('2023-12-25');
      });

      it('restores selectedServiceId from formData.serviceId if selectedServiceId is null', () => {
        store.selectedServiceId = null;
        store.formData.serviceId = 789;
        store.restorePageState();
        expect(store.selectedServiceId).toBe(789);
      });
       it('does not change selectedServiceId if it already has a value', () => {
        store.selectedServiceId = 111;
        store.formData.serviceId = 789;
        store.restorePageState();
        expect(store.selectedServiceId).toBe(111);
      });
    });
  });
});

// Ensure createEmptyFormData is correctly defined in the store for comparison
// If the store's createEmptyFormData has serviceId: null instead of undefined,
// then createEmptyFormDataForTest should also be serviceId: null
// Based on previous refactoring, it should be undefined.
// Check `src/stores/bookingStore.ts`'s `createEmptyFormData`
// function createEmptyFormData(): BookingFormData {
//   return {
//     ...
//     serviceId: undefined, // Correct
//     selectedStaffId: undefined, // Correct
//   }
// }

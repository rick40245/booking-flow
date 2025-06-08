/**
 * Service-related constant definitions
 * Provides data structures for services, staff, and service types.
 */

export interface Staff {
  id: number;
  name: string;
  type: string;
  availableSlots: string[];
  price: number;
}

export interface Service {
  id: number;
  name: string;
  type: string;
  duration: number;
  staffIds: number[];
}

export const SERVICE_TYPES_MAP = {
  hair: '美髮',
  spa: '美容',
  nails: '美甲',
} as const;

export const STAFF_MEMBERS: Staff[] = [
  { id: 1, name: 'Alice', type: 'hair', availableSlots: ['09:00', '10:00', '14:00'], price: 100 },
  { id: 2, name: 'Bob', type: 'spa', availableSlots: ['11:00', '15:00'], price: 120 },
  { id: 3, name: 'Charlie', type: 'hair', availableSlots: ['09:00', '11:00', '16:00'], price: 110 },
  { id: 4, name: 'Diana', type: 'nails', availableSlots: ['10:00', '14:00'], price: 90 },
];

export const SERVICES: Service[] = [
  { id: 101, name: 'Haircut', type: 'hair', duration: 60, staffIds: [1, 3] },
  { id: 102, name: 'Massage', type: 'spa', duration: 90, staffIds: [2] },
  { id: 103, name: 'Manicure', type: 'nails', duration: 45, staffIds: [4] },
  { id: 104, name: 'Blow Dry', type: 'hair', duration: 30, staffIds: [1] },
]; 
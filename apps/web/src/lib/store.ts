import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Car } from './dummyCars';

export type ServiceType = 'lepas_kunci' | 'dengan_sopir';

export interface Rental {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  serviceType: ServiceType;
}

interface BookingState {
  car: Car | null;
  rental: Rental;
  setCar: (c: Car) => void;
  setRental: (p: Partial<Rental>) => void;
  reset: () => void;
}

const today = new Date().toISOString().slice(0, 10);

export const useBooking = create<BookingState>()(
  persist(
    (set, get) => ({
      car: null,
      rental: {
        startDate: today,
        startTime: '09:00',
        endDate: today,
        endTime: '17:00',
        serviceType: 'lepas_kunci',
      },
      setCar: (car) => set({ car }),
      setRental: (p) => set({ rental: { ...get().rental, ...p } }),
      reset: () => set({ car: null }),
    }),
    { name: 'astera-booking' }
  )
);
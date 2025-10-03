// Data access layer for JSON-based storage
import venuesData from '@/db/venues.json';
import servicesData from '@/db/services.json';
import bookingsData from '@/db/bookings.json';

export interface Venue {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  description: string;
  basePrice: number;
  amenities: string[];
  images: string[];
  availability: boolean;
}

export interface Service {
  id: string;
  name: string;
  type: string;
  description: string;
  basePrice: number;
  unit: string;
  category: string;
  features: string[];
}

export interface BookingItem {
  serviceId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PersonalDetails {
  fullName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
}

export interface EventDetails {
  eventType: string;
  preferredDate: string;
  attendees: number;
  budgetRange: string;
  notes?: string;
}

export interface Booking {
  id: string;
  referenceId: string;
  status: 'draft' | 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';
  personalDetails: PersonalDetails;
  eventDetails: EventDetails;
  selectedServices: BookingItem[];
  selectedVenue?: string;
  totalEstimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

// Data access functions
export const getVenues = (): Venue[] => {
  return venuesData as Venue[];
};

export const getServices = (): Service[] => {
  return servicesData as Service[];
};

export const getBookings = (): Booking[] => {
  return getAllBookings();
};

export const getVenueById = (id: string): Venue | undefined => {
  return venuesData.find(venue => venue.id === id) as Venue | undefined;
};

export const getServiceById = (id: string): Service | undefined => {
  return servicesData.find(service => service.id === id) as Service | undefined;
};

export const getBookingById = (id: string): Booking | undefined => {
  return bookingsData.find(booking => booking.id === id) as Booking | undefined;
};

export const getBookingsByStatus = (status: string): Booking[] => {
  return bookingsData.filter(booking => booking.status === status) as Booking[];
};

// Event type options
export const eventTypes = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'other', label: 'Other' },
];

// Budget range options
export const budgetRanges = [
  { value: 'under-50k', label: 'Under ₹50,000' },
  { value: '50k-1L', label: '₹50,000 - ₹1,00,000' },
  { value: '1L-3L', label: '₹1,00,000 - ₹3,00,000' },
  { value: '3L-5L', label: '₹3,00,000 - ₹5,00,000' },
  { value: 'above-5L', label: 'Above ₹5,00,000' },
];

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Generate booking reference
export const generateBookingReference = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EVT-${year}-${randomNum}`;
};

// Save booking to localStorage
export const saveBooking = (booking: Booking): void => {
  const existingBookings = getBookings();
  const updatedBookings = [...existingBookings, booking];
  localStorage.setItem('bookings', JSON.stringify(updatedBookings));
};

// Get bookings from localStorage merged with JSON data
export const getAllBookings = (): Booking[] => {
  const jsonBookings = bookingsData as Booking[];
  const localBookingsStr = localStorage.getItem('bookings');
  const localBookings = localBookingsStr ? JSON.parse(localBookingsStr) : [];
  return [...jsonBookings, ...localBookings];
};
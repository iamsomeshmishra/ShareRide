export type UserRole = 'passenger' | 'rider';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Ride {
  id: string;
  riderId: string;
  riderName: string;
  riderRating?: number;
  pickup: Location;
  destination: Location;
  date: string;
  time: string;
  startTime?: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  price?: number; // Alias for pricePerSeat to fix potential mismatches
  status: 'active' | 'completed' | 'cancelled' | 'ongoing';
  passengers: string[]; // List of passenger IDs
  riderLocation?: {
    latitude: number;
    longitude: number;
  };
  createdAt: number;
}

export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  seatsBooked: number;
  totalPrice: number;
  totalFare?: number; // Alias for totalPrice to fix mismatches
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: number;
}

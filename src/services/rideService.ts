import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Ride, Booking } from '../types/ride';

const RIDES_COLLECTION = 'rides';
const BOOKINGS_COLLECTION = 'bookings';

export const rideService = {
  // Post a new ride (Rider flow)
  postRide: async (rideData: Omit<Ride, 'id' | 'createdAt' | 'status' | 'passengers'>) => {
    try {
      const docRef = await addDoc(collection(db, RIDES_COLLECTION), {
        ...rideData,
        status: 'active',
        passengers: [],
        createdAt: Date.now(),
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error posting ride:', error);
      throw error;
    }
  },

  // Search for rides (Passenger flow)
  searchRides: async (pickupAddress: string, destinationAddress: string) => {
    try {
      // In a real app, we would use GeoFirestore or Algolia for geo-searching.
      // For this MVP, we'll search by address string matching or just list all active rides.
      const q = query(
        collection(db, RIDES_COLLECTION),
        where('status', '==', 'active'),
        where('availableSeats', '>', 0),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const rides: Ride[] = [];
      querySnapshot.forEach((doc) => {
        rides.push({ id: doc.id, ...doc.data() } as Ride);
      });

      // Filter by address (simple string matching for MVP)
      return rides.filter(ride => 
        ride.pickup.address.toLowerCase().includes(pickupAddress.toLowerCase()) ||
        ride.destination.address.toLowerCase().includes(destinationAddress.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching rides:', error);
      return [];
    }
  },

  // Get ride details
  getRideDetails: async (rideId: string) => {
    try {
      const docRef = doc(db, RIDES_COLLECTION, rideId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Ride;
      }
      return null;
    } catch (error) {
      console.error('Error getting ride details:', error);
      throw error;
    }
  },

  // Real-time subscription to ride updates
  subscribeToRide: (rideId: string, callback: (ride: Ride) => void) => {
    const docRef = doc(db, RIDES_COLLECTION, rideId);
    const { onSnapshot } = require('firebase/firestore');
    return onSnapshot(docRef, (doc: any) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Ride);
      }
    });
  },

  // Get user's bookings (Passenger)
  getUserBookings: async (passengerId: string) => {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('passengerId', '==', passengerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const bookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  // Get user's posted rides (Rider)
  getUserRides: async (riderId: string) => {
    try {
      const q = query(
        collection(db, RIDES_COLLECTION),
        where('riderId', '==', riderId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const rides: Ride[] = [];
      querySnapshot.forEach((doc) => {
        rides.push({ id: doc.id, ...doc.data() } as Ride);
      });
      return rides;
    } catch (error) {
      console.error('Error fetching rides:', error);
      return [];
    }
  },

  // Update ride status or location
  updateRide: async (rideId: string, updates: Partial<Ride>) => {
    try {
      const docRef = doc(db, RIDES_COLLECTION, rideId);
      await updateDoc(docRef, updates);
      return { success: true };
    } catch (error) {
      console.error('Error updating ride:', error);
      throw error;
    }
  },

  // Book a ride (Passenger flow)
  bookRide: async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    try {
      // 1. Create booking record
      const bookingRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
        ...bookingData,
        status: 'confirmed', // Auto-confirm for MVP
        createdAt: Date.now(),
      });

      // 2. Update ride seats
      const rideRef = doc(db, RIDES_COLLECTION, bookingData.rideId);
      const rideSnap = await getDoc(rideRef);
      if (rideSnap.exists()) {
        const ride = rideSnap.data() as Ride;
        await updateDoc(rideRef, {
          availableSeats: ride.availableSeats - bookingData.seatsBooked,
          passengers: [...ride.passengers, bookingData.passengerId]
        });
      }

      return { id: bookingRef.id, success: true };
    } catch (error) {
      console.error('Error booking ride:', error);
      throw error;
    }
  }
};

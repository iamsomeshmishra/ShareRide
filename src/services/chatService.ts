import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  senderRole: 'passenger' | 'rider';
  createdAt: any;
}

export const chatService = {
  // Send a message
  sendMessage: async (rideId: string, text: string, senderId: string, senderRole: 'passenger' | 'rider') => {
    try {
      await addDoc(collection(db, 'rides', rideId, 'messages'), {
        text,
        senderId,
        senderRole,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Listen for messages
  subscribeToMessages: (rideId: string, onUpdate: (messages: ChatMessage[]) => void) => {
    const q = query(
      collection(db, 'rides', rideId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      onUpdate(messages);
    });
  }
};


import { Timestamp } from "firebase/firestore";

export type ClaimantInfo = {
  fullName: string;
  email: string;
};

export type Item = {
  id: string;
  type: 'lost' | 'found';
  name:string;
  category: string;
  description: string;
  distinguishingMarks?: string;
  location: string;
  date: Date | Timestamp;
  imageUrl: string;
  contact: string;
  phoneNumber?: string;
  lat: number;
  lng: number;
  createdAt?: Timestamp;
  userId?: string;
  status?: 'open' | 'resolved';
  claimantInfo?: ClaimantInfo;
};

export type Claim = {
  id: string;
  itemId: string;
  itemOwnerId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  proof: string;
  submittedAt: Timestamp;
  location?: string;
  date?: Timestamp;
  status: 'open' | 'accepted' | 'resolved';
  type?: 'message' | 'claim';
  userId: string; // The ID of the user who made the claim/message
  chatId: string;
};

export type Feedback = {
  id: string;
  rating: number;
  story: string;
  userId: string;
  userName: string;
  itemName: string;
  itemId: string;
  finderId: string;
  finderName: string;
  createdAt: string;
};

export type Message = {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    createdAt: Timestamp | Date;
}


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
  status: 'open' | 'resolved';
  type?: 'message' | 'claim';
};

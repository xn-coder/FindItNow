
import { Timestamp } from "firebase/firestore";

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
  lat: number;
  lng: number;
  createdAt?: Timestamp;
  userId?: string;
};

export type Claim = {
  id: string;
  itemId: string;
  itemOwnerId: string;
  fullName: string;
  email: string;
  proof: string;
  submittedAt: Timestamp;
};

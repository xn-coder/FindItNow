
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

export type GalleryImage = {
  id?: string;
  itemId: string;
  imageUrl: string; // Base64 string
  createdAt: Timestamp;
};

export type Claim = {
  id: string;
  itemId: string;
  itemName: string;
  itemOwnerId: string;
  fullName:string;
  email: string;
  phoneNumber?: string;
  proof: string;
  proofImageUrl?: string;
  submittedAt: Date | Timestamp;
  location?: string;
  date?: Timestamp;
  status: 'open' | 'accepted' | 'resolving' | 'resolved' | 'rejected';
  type?: 'message' | 'claim';
  userId: string; // The ID of the user who made the claim/message
  chatId: string;
  ownerRead: boolean;
  claimantRead: boolean;
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

export type Notification = {
    id: string;
    userId: string; // The user who should see this notification
    message: string;
    link: string;
    createdAt: Date;
    read: boolean;
    type: 'new_enquiry' | 'claim_accepted' | 'item_resolved';
};

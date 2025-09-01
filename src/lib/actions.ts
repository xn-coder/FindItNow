
'use server';

import { z } from 'zod';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, limit, orderBy, serverTimestamp, doc, updateDoc, writeBatch } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import type { Notification, Claim } from './types';


// Schema for new user creation
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Schema for user login
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});


// Schema for new partner creation
const PartnerSchema = z.object({
  businessName: z.string().min(2),
  businessType: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

// Schema for partner login
const PartnerLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const FeedbackSchema = z.object({
    rating: z.number().min(1).max(5),
    story: z.string().min(10).max(500),
    userId: z.string(),
    userName: z.string(),
    itemName: z.string(),
    finderId: z.string(),
    finderName: z.string(),
    itemId: z.string(),
});

const UpdatePasswordSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

const MessageSchema = z.object({
    chatId: z.string(),
    senderId: z.string(),
    text: z.string().min(1).max(1000),
});

const GalleryImageSchema = z.object({
    itemId: z.string(),
    imageUrl: z.string(),
});


/**
 * Creates a new user in the Firestore 'users' collection.
 * Hashes the password before storing.
 * @param userData - The user data matching the UserSchema.
 */
export async function createUser(userData: z.infer<typeof UserSchema>) {
  const validatedData = UserSchema.parse(userData);

  // Check if user already exists
  const existingUser = await getUserByEmail(validatedData.email);
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const userToStore = {
    email: validatedData.email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'users'), userToStore);

  return { id: docRef.id, email: validatedData.email };
}

/**
 * Retrieves a user from Firestore by their email address.
 * @param email - The email of the user to find.
 * @returns The user object if found, otherwise null.
 */
export async function getUserByEmail(email: string) {
  if (!email) return null;

  const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();
  
  // Convert Timestamp to a plain object
  const { createdAt, ...rest } = userData;
  const serializedCreatedAt = createdAt instanceof Timestamp ? createdAt.toJSON() : createdAt;

  return { id: userDoc.id, ...rest, createdAt: serializedCreatedAt };
}

/**
 * Authenticates a user by checking their email and password.
 * @param credentials - The user's login credentials.
 */
export async function loginUser(credentials: z.infer<typeof LoginSchema>) {
    const validatedData = LoginSchema.parse(credentials);

    const user = await getUserByEmail(validatedData.email);

    if (!user) {
        throw new Error('No user found with this email address.');
    }

    if (!user.password) {
        throw new Error('This account is not set up with a password.');
    }

    const passwordsMatch = await bcrypt.compare(validatedData.password, user.password as string);

    if (!passwordsMatch) {
        throw new Error('Invalid password.');
    }
    
    // Here you would typically create a session, set a cookie, or return a JWT.
    // For now, we just return the user data (excluding password).
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}


/**
 * Creates a new partner in the Firestore 'partners' collection.
 */
export async function createPartner(partnerData: z.infer<typeof PartnerSchema>) {
  const validatedData = PartnerSchema.parse(partnerData);

  const existingPartner = await getPartnerByEmail(validatedData.email);
  if (existingPartner) {
    throw new Error('A partner with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const partnerToStore = {
    email: validatedData.email.toLowerCase(),
    password: hashedPassword,
    businessName: validatedData.businessName,
    businessType: validatedData.businessType,
    createdAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'partners'), partnerToStore);

  return { id: docRef.id, email: validatedData.email, businessName: validatedData.businessName };
}

/**
 * Retrieves a partner from Firestore by their email address.
 */
export async function getPartnerByEmail(email: string) {
  if (!email) return null;

  const q = query(collection(db, 'partners'), where('email', '==', email.toLowerCase()));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const partnerDoc = querySnapshot.docs[0];
  const partnerData = partnerDoc.data();

  const { createdAt, ...rest } = partnerData;
  const serializedCreatedAt = createdAt instanceof Timestamp ? createdAt.toJSON() : createdAt;

  return { id: partnerDoc.id, ...rest, createdAt: serializedCreatedAt };
}


/**
 * Authenticates a partner by checking their email and password.
 * @param credentials - The partner's login credentials.
 */
export async function loginPartner(credentials: z.infer<typeof PartnerLoginSchema>) {
    const validatedData = PartnerLoginSchema.parse(credentials);

    const partner = await getPartnerByEmail(validatedData.email);

    if (!partner) {
        return { error: 'Invalid credentials or user not found.' };
    }

    if (!partner.password) {
        return { error: 'This partner account does not have a password.' };
    }

    const passwordsMatch = await bcrypt.compare(validatedData.password, partner.password as string);

    if (!passwordsMatch) {
        return { error: 'Invalid credentials.' };
    }
    
    const { password, ...partnerWithoutPassword } = partner;
    return { success: partnerWithoutPassword };
}

/**
 * Submits feedback to the 'feedback' collection in Firestore.
 */
export async function submitFeedback(feedbackData: z.infer<typeof FeedbackSchema>) {
    const validatedData = FeedbackSchema.parse(feedbackData);
    
    await addDoc(collection(db, 'feedback'), {
        ...validatedData,
        createdAt: serverTimestamp(),
    });

    return { success: true };
}


/**
 * Retrieves the most recent feedback entries from Firestore.
 */
export async function getRecentFeedback() {
    const q = query(
        collection(db, "feedback"),
        orderBy("createdAt", "desc"),
        limit(3)
    );
    const querySnapshot = await getDocs(q);
    
    const feedbackData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
        };
    });
    
    return feedbackData;
}

/**
 * Updates a user's password in Firestore.
 */
export async function updateUserPassword(data: z.infer<typeof UpdatePasswordSchema>) {
    const validatedData = UpdatePasswordSchema.parse(data);

    const user = await getUserByEmail(validatedData.email);
    if (!user) {
        throw new Error('User not found.');
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const userRef = doc(db, 'users', user.id);

    await updateDoc(userRef, {
        password: hashedPassword,
    });

    return { success: true };
}

/**
 * Updates a partner's password in Firestore.
 */
export async function updatePartnerPassword(data: z.infer<typeof UpdatePasswordSchema>) {
    const validatedData = UpdatePasswordSchema.parse(data);

    const partner = await getPartnerByEmail(validatedData.email);
    if (!partner) {
        throw new Error('Partner not found.');
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const partnerRef = doc(db, 'partners', partner.id);

    await updateDoc(partnerRef, {
        password: hashedPassword,
    });

    return { success: true };
}

/**
 * Sends a message in a chat.
 */
export async function sendMessage(messageData: z.infer<typeof MessageSchema>) {
    const validatedData = MessageSchema.parse(messageData);
    
    const message = {
        ...validatedData,
        createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(db, "chats", validatedData.chatId, "messages"), message);
}

/**
 * Fetches messages for a specific chat.
 */
export async function getMessages(chatId: string) {
    const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        };
    });
}

export async function addGalleryImage(imageData: z.infer<typeof GalleryImageSchema>) {
    const validatedData = GalleryImageSchema.parse(imageData);
    await addDoc(collection(db, "gallery"), {
        ...validatedData,
        createdAt: serverTimestamp(),
    });
    return { success: true };
}

/**
 * Retrieves all gallery images for a specific item.
 */
export async function getGalleryImages(itemId: string) {
    if (!itemId) return [];

    const q = query(
        collection(db, "gallery"),
        where("itemId", "==", itemId),
        orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        };
    });
}

export async function getNotificationCount(userId: string): Promise<number> {
    if (!userId) return 0;

    // 1. New enquiries on items owned by the user.
    const newEnquiriesQuery = query(
        collection(db, "claims"),
        where("itemOwnerId", "==", userId),
        where("status", "==", "open"),
        where("ownerRead", "==", false)
    );
    const newEnquiriesSnapshot = await getDocs(newEnquiriesQuery);
    const newEnquiriesCount = newEnquiriesSnapshot.size;
    
    // 2. Claims the user made that have been accepted.
    const acceptedClaimsQuery = query(
        collection(db, "claims"),
        where("userId", "==", userId),
        where("status", "==", "accepted"),
        where("claimantRead", "==", false)
    );
    const acceptedClaimsSnapshot = await getDocs(acceptedClaimsQuery);
    const acceptedClaimsCount = acceptedClaimsSnapshot.size;

    return newEnquiriesCount + acceptedClaimsCount;
}


export async function getNotifications(userId: string): Promise<Notification[]> {
  if (!userId) return [];

  const notifications: Notification[] = [];
  const batch = writeBatch(db);

  // 1. Get new enquiries on items the user owns
  const newEnquiriesQuery = query(
    collection(db, "claims"),
    where("itemOwnerId", "==", userId),
    where("status", "==", "open")
  );
  const newEnquiriesSnapshot = await getDocs(newEnquiriesQuery);
  newEnquiriesSnapshot.forEach(docSnap => {
    const claim = docSnap.data() as Claim;
    notifications.push({
      id: docSnap.id,
      userId: userId,
      message: `New enquiry for your '${claim.itemName}' from ${claim.fullName}.`,
      link: `/chat/${claim.chatId}`,
      createdAt: claim.submittedAt.toDate(),
      read: claim.ownerRead,
      type: 'new_enquiry'
    });
    if (!claim.ownerRead) {
        batch.update(docSnap.ref, { ownerRead: true });
    }
  });

  // 2. Get claims the user made that were accepted
  const acceptedClaimsQuery = query(
    collection(db, "claims"),
    where("userId", "==", userId),
    where("status", "==", "accepted")
  );
  const acceptedClaimsSnapshot = await getDocs(acceptedClaimsQuery);
  acceptedClaimsSnapshot.forEach(docSnap => {
    const claim = docSnap.data() as Claim;
    notifications.push({
      id: docSnap.id,
      userId: userId,
      message: `Your claim for '${claim.itemName}' has been accepted.`,
      link: `/chat/${claim.chatId}`,
      createdAt: claim.submittedAt.toDate(), // This should ideally be an 'acceptedAt' timestamp
      read: claim.claimantRead,
      type: 'claim_accepted'
    });
     if (!claim.claimantRead) {
        batch.update(docSnap.ref, { claimantRead: true });
    }
  });

   // 3. Get claims the user made for items that were resolved
  const resolvedClaimsQuery = query(
    collection(db, "claims"),
    where("userId", "==", userId),
    where("status", "==", "resolved")
  );
  const resolvedClaimsSnapshot = await getDocs(resolvedClaimsQuery);
  resolvedClaimsSnapshot.forEach(docSnap => {
    const claim = docSnap.data() as Claim;
    notifications.push({
      id: docSnap.id,
      userId: userId,
      message: `The item '${claim.itemName}' you claimed has been marked as resolved.`,
      link: `/account`,
      createdAt: claim.submittedAt.toDate(), // This should ideally be a 'resolvedAt' timestamp
      read: claim.claimantRead,
      type: 'item_resolved'
    });
    if (!claim.claimantRead) {
        batch.update(docSnap.ref, { claimantRead: true });
    }
  });

  await batch.commit();

  // Sort notifications by date, most recent first
  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

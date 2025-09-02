
'use server';

import { z } from 'zod';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, limit, orderBy, serverTimestamp, doc, updateDoc, writeBatch, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import type { Notification, Claim, Category, EmailTemplate } from './types';
import { emailTemplates as defaultEmailTemplates, templateContents as defaultTemplateContents } from './email-templates';
import { subMonths, startOfMonth, endOfMonth, format, subDays } from 'date-fns';


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
    lastActivity: new Date(),
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
  
  const { createdAt, lastActivity, ...rest } = userData;

  return { 
    id: userDoc.id, 
    ...rest, 
    createdAt: (createdAt as Timestamp)?.toDate() || new Date(),
    lastActivity: (lastActivity as Timestamp)?.toDate() || new Date()
  };
}

/**
 * Authenticates a user by checking their email and password.
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
    
    // Update last activity on login
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, { lastActivity: new Date() });

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
    lastActivity: new Date(),
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

  const { createdAt, lastActivity, ...rest } = partnerData;

  return { 
      id: partnerDoc.id, 
      ...rest, 
      createdAt: (createdAt as Timestamp)?.toDate() || new Date(),
      lastActivity: (lastActivity as Timestamp)?.toDate() || new Date()
    };
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
    
    // Update last activity on login
    const partnerRef = doc(db, 'partners', partner.id);
    await updateDoc(partnerRef, { lastActivity: new Date() });

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

/**
 * Retrieves all users from Firestore.
 */
export async function getAllUsers() {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const { password, ...userWithoutPassword } = data;
        return {
            id: doc.id,
            ...userWithoutPassword,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        };
    });
}

/**
 * Retrieves all partners from Firestore.
 */
export async function getAllPartners() {
    const q = query(collection(db, "partners"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const { password, ...partnerWithoutPassword } = data;
        return {
            id: doc.id,
            ...partnerWithoutPassword,
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        };
    });
}

/**
 * Retrieves all items from Firestore, sorted by creation date.
 */
export async function getAllItems() {
  const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: (data.date as Timestamp)?.toDate() || new Date(),
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    };
  });
}

/**
 * Deletes an item from Firestore.
 */
export async function deleteItem(itemId: string) {
  if (!itemId) {
    throw new Error('Item ID is required.');
  }
  const itemRef = doc(db, 'items', itemId);
  await deleteDoc(itemRef);
  return { success: true };
}

/**
 * Marks an item as resolved in Firestore.
 */
export async function resolveItem(itemId: string, claimantInfo?: { fullName: string; email: string }) {
  if (!itemId) {
    throw new Error('Item ID is required.');
  }
  const itemRef = doc(db, 'items', itemId);
  await updateDoc(itemRef, {
    status: 'resolved',
    claimantInfo: claimantInfo || { fullName: 'Admin', email: 'Resolved manually' },
  });
  return { success: true };
}

/**
 * Retrieves all claims from Firestore, sorted by submission date.
 */
export async function getAllClaims(): Promise<Claim[]> {
  const q = query(collection(db, 'claims'), orderBy('submittedAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      submittedAt: (data.submittedAt as Timestamp)?.toDate() || new Date(),
      date: (data.date as Timestamp)?.toDate() || undefined,
    } as Claim;
  });
}

/**
 * Updates the status of a claim.
 */
export async function updateClaimStatus(claimId: string, status: 'accepted' | 'rejected' | 'resolved') {
  if (!claimId) {
    throw new Error('Claim ID is required.');
  }
  const claimRef = doc(db, 'claims', claimId);
  await updateDoc(claimRef, { status });
  return { success: true };
}


// SETTINGS ACTIONS

/**
 * Retrieves a settings document from Firestore.
 * @param settingId - The ID of the setting document (e.g., 'categories').
 */
export async function getSettings(settingId: string) {
    const docRef = doc(db, 'settings', settingId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}

/**
 * Updates a settings document in Firestore.
 * @param settingId - The ID of the setting document.
 * @param data - The data to set.
 */
export async function updateSettings(settingId: string, data: any) {
    const docRef = doc(db, 'settings', settingId);
    await setDoc(docRef, data, { merge: true });
    return { success: true };
}

export async function getItemCategories(): Promise<Category[]> {
    const settings = await getSettings('categories');
    return settings?.list || [];
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
    const settings = await getSettings('emailTemplates');
    return settings?.list || [];
}


const defaultCategories = [
    "electronics", "wallets", "keys", "accessories", "bags", "clothing",
    "bottles", "toys", "documents", "other"
].map((name, index) => ({ id: (index + 1).toString(), name }));

export async function initializeDefaultSettings() {
    // Initialize Categories
    const categoriesDoc = await getSettings('categories');
    if (!categoriesDoc) {
        console.log("Initializing default categories in Firestore...");
        await updateSettings('categories', { list: defaultCategories });
    }

    // Initialize Email Templates
    const emailTemplatesDoc = await getSettings('emailTemplates');
    if (!emailTemplatesDoc) {
        console.log("Initializing default email templates in Firestore...");
        const templatesToStore = defaultEmailTemplates.map(t => ({
            ...t,
            ...defaultTemplateContents[t.id],
        }));
        await updateSettings('emailTemplates', { list: templatesToStore });
    }
}


// Analytics Actions
export async function getDashboardAnalytics() {
    try {
        // 1. Items Posted vs Resolved for the last 6 months
        const monthlyStats: { month: string; posted: number; resolved: number }[] = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(today, i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);
            const monthName = format(date, 'MMMM');

            const itemsQuery = query(
                collection(db, "items"),
                where("createdAt", ">=", start),
                where("createdAt", "<=", end)
            );
            const itemsSnapshot = await getDocs(itemsQuery);
            
            const posted = itemsSnapshot.size;
            const resolved = itemsSnapshot.docs.filter(doc => doc.data().status === 'resolved').length;
            
            monthlyStats.push({
                month: monthName,
                posted: posted,
                resolved: resolved,
            });
        }

        // 2. Active Users (active in the last 30 days)
        const thirtyDaysAgo = subDays(today, 30);
        const activeUsersQuery = query(
            collection(db, "users"),
            where("lastActivity", ">=", thirtyDaysAgo)
        );
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        const activeUsersCount = activeUsersSnapshot.size;

        // 3. Partner Satisfaction
        const feedbackQuery = query(collection(db, "feedback"));
        const feedbackSnapshot = await getDocs(feedbackQuery);
        let totalRating = 0;
        let ratingCount = 0;
        feedbackSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.rating) {
                totalRating += data.rating;
                ratingCount++;
            }
        });
        const partnerSatisfaction = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0";


        return {
            monthlyStats,
            activeUsersCount,
            partnerSatisfaction,
        };

    } catch (error) {
        console.error("Error fetching dashboard analytics: ", error);
        throw new Error("Failed to fetch analytics data.");
    }
}

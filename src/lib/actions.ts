
'use server';

import { z } from 'zod';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, limit, orderBy, serverTimestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { sendEmail as sendEmailJs } from './email';


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


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


export async function sendOtp(email: string, subject: string) {
    const emailJsEnabled = process.env.NEXT_PUBLIC_EMAILJS_ENABLED !== 'false';
    let generatedOtp;

    if (emailJsEnabled) {
      generatedOtp = generateOtp();
      await sendEmailJs({
        to_email: email,
        subject: subject,
        message: `Your one-time password is: ${generatedOtp}`,
      });
    } else {
      // For development/testing without EmailJS credentials
      generatedOtp = "123456"; 
    }

    return generatedOtp;
}


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
        throw new Error('No partner found with this email address.');
    }

    if (!partner.password) {
        // This case should ideally not happen if registration enforces password.
        throw new Error('This partner account does not have a password.');
    }

    const passwordsMatch = await bcrypt.compare(validatedData.password, partner.password as string);

    if (!passwordsMatch) {
        throw new Error('Invalid password.');
    }
    
    const { password, ...partnerWithoutPassword } = partner;
    return partnerWithoutPassword;
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

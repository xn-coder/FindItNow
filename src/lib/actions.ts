'use server';

import { z } from 'zod';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

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

  const docData = (await getDocs(query(collection(db, 'users'), where('email', '==', validatedData.email)))).docs[0].data();

  const { createdAt, ...rest } = docData;

  return { 
    id: docRef.id, 
    ...rest, 
    createdAt: createdAt instanceof Timestamp ? createdAt.toJSON() : createdAt 
  };
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

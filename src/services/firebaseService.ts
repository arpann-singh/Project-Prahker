import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  addDoc,
  increment
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile
export async function saveUserProfile(userData: { uid: string; email: string; displayName?: string; photoURL?: string }) {
  const path = `users/${userData.uid}`;
  try {
    const userDocRef = doc(db, 'users', userData.uid);
    const userSnap = await getDoc(userDocRef);
    
    let additionalFields = {};
    if (!userSnap.exists()) {
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0); // Sets to next midnight UTC
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      additionalFields = {
        tokensUsed: 0,
        tokenLimit: 100000,
        tokenResetTime: tomorrow.toISOString(),
        monthlyTokensUsed: 0,
        monthlyTokenLimit: 3000000,
        monthlyTokenResetTime: nextMonth.toISOString(),
      };
    }
    
    await setDoc(userDocRef, {
      ...userData,
      ...additionalFields,
      createdAt: userSnap.exists() ? userSnap.data()?.createdAt : serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function incrementUserTokens(userId: string, amount: number) {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      tokensUsed: increment(amount),
      monthlyTokensUsed: increment(amount),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Workspaces
export async function saveWorkspace(workspace: any) {
  if (!auth.currentUser) return;
  const path = `workspaces/${workspace.id}`;
  try {
    await setDoc(doc(db, 'workspaces', workspace.id), {
      ...workspace,
      userId: auth.currentUser.uid,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserWorkspaces() {
  if (!auth.currentUser) return [];
  const path = 'workspaces';
  try {
    const q = query(collection(db, 'workspaces'), where('userId', '==', auth.currentUser.uid), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Sessions
export async function saveSession(sessionData: any) {
  if (!auth.currentUser) return;
  const path = 'sessions';
  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveResponse(sessionId: string, responseData: any) {
  const path = `sessions/${sessionId}/responses`;
  try {
    await addDoc(collection(db, 'sessions', sessionId, 'responses'), {
      ...responseData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getSessionHistory() {
  if (!auth.currentUser) return [];
  const path = 'sessions';
  try {
    const q = query(collection(db, 'sessions'), where('userId', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

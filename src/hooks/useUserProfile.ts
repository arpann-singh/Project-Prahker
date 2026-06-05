import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any;
  tokensUsed: number;
  tokenLimit: number;
  tokenResetTime: string;
  monthlyTokensUsed: number;
  monthlyTokenLimit: number;
  monthlyTokenResetTime: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      
      const unsubscribeSnap = onSnapshot(userDocRef, async (snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          
          // Fallbacks for safety in case some older accounts do not have token details
          const tokensUsed = typeof data.tokensUsed === 'number' ? data.tokensUsed : 0;
          const tokenLimit = typeof data.tokenLimit === 'number' ? data.tokenLimit : 100000;
          const tokenResetTime = data.tokenResetTime || new Date(Date.now() + 86400000).toISOString();

          // Monthly token limits and reset time tracking (default 3,000,000 free-tier limit)
          const monthlyTokensUsed = typeof data.monthlyTokensUsed === 'number' ? data.monthlyTokensUsed : 0;
          const monthlyTokenLimit = typeof data.monthlyTokenLimit === 'number' ? data.monthlyTokenLimit : 3000000;
          const monthlyTokenResetTime = data.monthlyTokenResetTime || new Date(Date.now() + 30 * 86400000).toISOString();

          const resetTime = new Date(tokenResetTime);
          const monthlyResetTime = new Date(monthlyTokenResetTime);
          const now = new Date();
          
          let needsUpdate = false;
          let updateObj: any = {};

          if (resetTime < now) {
            const nextReset = new Date();
            nextReset.setUTCHours(24, 0, 0, 0); // Next UTC midnight
            updateObj.tokensUsed = 0;
            updateObj.tokenResetTime = nextReset.toISOString();
            needsUpdate = true;
          }

          if (monthlyResetTime < now) {
            const nextMonthlyReset = new Date();
            nextMonthlyReset.setMonth(nextMonthlyReset.getMonth() + 1);
            updateObj.monthlyTokensUsed = 0;
            updateObj.monthlyTokenResetTime = nextMonthlyReset.toISOString();
            needsUpdate = true;
          }
          
          if (needsUpdate) {
            try {
              await setDoc(userDocRef, updateObj, { merge: true });
            } catch (err) {
              console.error('Error resetting dynamic tokens:', err);
            }
          } else {
            setProfile({
              ...data,
              tokensUsed,
              tokenLimit,
              tokenResetTime,
              monthlyTokensUsed,
              monthlyTokenLimit,
              monthlyTokenResetTime,
            });
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }, (error) => {
        console.error('Profile snapshot listener error:', error);
        setLoading(false);
      });

      return () => unsubscribeSnap();
    });

    return () => unsubscribeAuth();
  }, []);

  return { profile, loading };
};

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase/client";
import { createLogger } from "../lib/logger";

const logger = createLogger("Auth");

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authError: string | null;
  authLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  changeEmail: (newEmail: string, currentPassword: string) => Promise<void>;
  changePassword: (newPassword: string, currentPassword: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Track signup in analytics
      if (typeof window !== "undefined") {
        const { trackSignup } = await import("../lib/firebase/analytics");
        trackSignup("email");
      }
      
      // onAuthStateChanged will update user
    } catch (error: any) {
      logger.warn("signUp error", error, { action: "signUp" });
      setAuthError(
        error?.message ?? "Could not sign up. Please check your details."
      );
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Track login in analytics
      if (typeof window !== "undefined") {
        const { trackLogin } = await import("../lib/firebase/analytics");
        trackLogin("email");
      }
    } catch (error: any) {
      logger.warn("signIn error", error, { action: "signIn" });
      setAuthError(
        error?.message ?? "Could not sign in. Please check your credentials."
      );
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      logger.warn("signOut error", error, { action: "signOut" });
      setAuthError(error?.message ?? "Could not sign out.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!user) {
      setAuthError("No user logged in");
      return;
    }
    
    setAuthLoading(true);
    setAuthError(null);
    try {
      await sendEmailVerification(user);
    } catch (error: any) {
      logger.warn("resendVerificationEmail error", error, { action: "resendVerificationEmail" });
      setAuthError(error?.message ?? "Could not send verification email.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const changeEmail = async (newEmail: string, currentPassword: string) => {
    if (!user || !user.email) {
      setAuthError("No user logged in");
      throw new Error("No user logged in");
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      // Re-authenticate user before changing email
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email
      await updateEmail(user, newEmail);
      
      // Send verification email to new address
      await sendEmailVerification(user);
    } catch (error: any) {
      logger.warn("changeEmail error", error, { action: "changeEmail" });
      setAuthError(error?.message ?? "Could not change email. Please check your current password.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const changePassword = async (newPassword: string, currentPassword: string) => {
    if (!user || !user.email) {
      setAuthError("No user logged in");
      throw new Error("No user logged in");
    }

    setAuthLoading(true);
    setAuthError(null);
    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
    } catch (error: any) {
      logger.warn("changePassword error", error, { action: "changePassword" });
      setAuthError(error?.message ?? "Could not change password. Please check your current password.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      logger.warn("sendPasswordReset error", error, { action: "sendPasswordReset" });
      setAuthError(error?.message ?? "Could not send password reset email.");
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    authError,
    authLoading,
    signUp,
    signIn,
    signOut,
    resendVerificationEmail,
    changeEmail,
    changePassword,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}


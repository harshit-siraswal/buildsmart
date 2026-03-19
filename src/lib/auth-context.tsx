/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
} from "firebase/auth";
import { auth } from "./firebase";

const PROFILE_META_KEY = "buildsmart-profile-meta";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
  avatarUrl?: string;
  company?: string;
  role?: string;
  bio?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type ProfileMeta = Pick<AuthUser, "company" | "role" | "bio">;

function readProfileMeta(): Record<string, ProfileMeta> {
  const raw = localStorage.getItem(PROFILE_META_KEY);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, ProfileMeta>;
  } catch {
    return {};
  }
}

function writeProfileMeta(data: Record<string, ProfileMeta>) {
  localStorage.setItem(PROFILE_META_KEY, JSON.stringify(data));
}

function mapAuthUser(): AuthUser | null {
  const current = auth.currentUser;
  if (!current) {
    return null;
  }

  const meta = readProfileMeta()[current.uid] ?? {};
  const provider = current.providerData.some((entry) => entry.providerId === "google.com")
    ? "google"
    : "email";

  return {
    id: current.uid,
    name: current.displayName ?? current.email?.split("@")[0] ?? "User",
    email: current.email ?? "",
    provider,
    avatarUrl: current.photoURL ?? undefined,
    company: meta.company,
    role: meta.role,
    bio: meta.bio,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setUser(mapAuthUser());
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
      async login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      },
      async signup({ name, email, password }) {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password,
        );

        await updateFirebaseProfile(credentials.user, {
          displayName: name.trim(),
          photoURL: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
        });

        const existing = readProfileMeta();
        existing[credentials.user.uid] = { company: "", role: "", bio: "" };
        writeProfileMeta(existing);
        setUser(mapAuthUser());
      },
      async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const credentials = await signInWithPopup(auth, provider);

        const existing = readProfileMeta();
        if (!existing[credentials.user.uid]) {
          existing[credentials.user.uid] = { company: "", role: "", bio: "" };
          writeProfileMeta(existing);
        }
      },
      async logout() {
        await signOut(auth);
      },
      async updateProfile(updates: Partial<AuthUser>) {
        if (!auth.currentUser) {
          return;
        }

        const current = auth.currentUser;
        const nextName = updates.name?.trim();

        if (nextName || updates.avatarUrl) {
          await updateFirebaseProfile(current, {
            displayName: nextName || current.displayName || undefined,
            photoURL: updates.avatarUrl || current.photoURL || undefined,
          });
        }

        const existing = readProfileMeta();
        existing[current.uid] = {
          company: updates.company ?? existing[current.uid]?.company,
          role: updates.role ?? existing[current.uid]?.role,
          bio: updates.bio ?? existing[current.uid]?.bio,
        };
        writeProfileMeta(existing);
        setUser(mapAuthUser());
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return ctx;
}

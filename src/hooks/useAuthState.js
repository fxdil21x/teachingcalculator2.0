import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ADMIN_EMAIL, auth, db } from "../services/firebase";

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile;
    const unsubAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setProfile(null);
      if (unsubProfile) unsubProfile();
      if (!nextUser) {
        setLoading(false);
        return;
      }
      unsubProfile = onSnapshot(doc(db, "users", nextUser.uid), (snap) => {
        setProfile(snap.exists() ? snap.data() : null);
        setLoading(false);
      });
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isApproved = Boolean(isAdmin || (profile && profile.status === "approved"));

  return { user, profile, isAdmin, isApproved, loading };
}

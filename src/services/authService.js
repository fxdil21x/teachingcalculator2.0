import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, readUserProfile } from "./dataService";

export async function signup(email, password) {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(res.user.uid, email);
  await signOut(auth);
}

export async function login(email, password, adminEmail) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const udoc = await readUserProfile(cred.user.uid);
  const isAdminEmail = email?.toLowerCase() === adminEmail?.toLowerCase();
  if (isAdminEmail || (udoc && udoc.status === "approved")) return;
  await signOut(auth);
  throw new Error("Not approved yet");
}

export async function logout() {
  await signOut(auth);
}

export async function forgotPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, readUserProfile } from "./dataService";

export async function signup(email, password, name = "") {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(res.user.uid, email, name);
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

export async function changePassword(oldPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently logged in");

  // Reauthenticate the user with their current password
  const credential = EmailAuthProvider.credential(user.email, oldPassword);
  await reauthenticateWithCredential(user, credential);

  // Update the password
  await updatePassword(user, newPassword);
}

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

function uidRequired() {
  if (!auth.currentUser?.uid) throw new Error("Please login first");
  return auth.currentUser.uid;
}

export async function listInstitutes() {
  const uid = uidRequired();
  const snap = await getDocs(collection(db, "users", uid, "institutes"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addInstitute(payload) {
  const uid = uidRequired();
  await addDoc(collection(db, "users", uid, "institutes"), payload);
}

export async function updateInstitute(id, payload) {
  const uid = uidRequired();
  await updateDoc(doc(db, "users", uid, "institutes", id), payload);
}

export async function removeInstitute(id) {
  const uid = uidRequired();
  await deleteDoc(doc(db, "users", uid, "institutes", id));
}

export async function listEntries() {
  const uid = uidRequired();
  const snap = await getDocs(collection(db, "users", uid, "entries"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listEntriesByUser(uid) {
  const snap = await getDocs(collection(db, "users", uid, "entries"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addEntry(payload) {
  const uid = uidRequired();
  await addDoc(collection(db, "users", uid, "entries"), payload);
}

export async function removeEntry(id) {
  const uid = uidRequired();
  await deleteDoc(doc(db, "users", uid, "entries", id));
}

export async function updateEntry(id, payload) {
  const uid = uidRequired();
  await updateDoc(doc(db, "users", uid, "entries", id), payload);
}

export async function listUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listInstitutesByUser(uid) {
  const snap = await getDocs(collection(db, "users", uid, "institutes"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function approveUser(uid) {
  await updateDoc(doc(db, "users", uid), { status: "approved" });
  await setDoc(doc(db, "users", uid, "meta", "init"), { createdAt: new Date() });
}

export async function rejectUser(uid) {
  await updateDoc(doc(db, "users", uid), { status: "rejected" });
}

export async function createUserProfile(uid, email) {
  await setDoc(doc(db, "users", uid), { email, status: "pending" });
}

export async function readUserProfile(uid) {
  const profile = await getDoc(doc(db, "users", uid));
  return profile.exists() ? profile.data() : null;
}

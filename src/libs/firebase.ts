import {initializeApp} from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import {initializeFirestore, getFirestore} from 'firebase/firestore';

import {Store} from 'vuex';

import {StoreState} from '@/types/store';

export const app = initializeApp({
  apiKey: 'AIzaSyAGkZ3L3tOBu384iHiXtUpcRvjm8W7YhJM',
  authDomain: 'ann-radar-prototype-project.firebaseapp.com',
  projectId: 'ann-radar-prototype-project',
  storageBucket: 'ann-radar-prototype-project.appspot.com',
  messagingSenderId: '1054456327433',
  appId: '1:1054456327433:web:653829c93cbe9b571c77d8'
});

/** Authentication */
export const auth = getAuth();

export const initializeAuth = (store: Store<StoreState>) =>
  onAuthStateChanged(auth, user => {
    store.commit('user/setUser', user || null);
    store.dispatch('user/fetchUserRoles');
  });

export const logIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

/** Firestore */
initializeFirestore(app, {ignoreUndefinedProperties: true});
export const database = getFirestore(app);

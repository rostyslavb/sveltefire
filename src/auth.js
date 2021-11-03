import { writable } from 'svelte/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getApp } from './context';

export function userStore() {
  const app = getApp();

  const store = writable(null, () => {
    const teardown = onAuthStateChanged(getAuth(app), set);
    return () => teardown;
  });

  const { subscribe, set } = store;

  return {
    subscribe,
  };
}

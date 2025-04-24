// user-store.ts
import { makeAutoObservable } from 'mobx';
import { DetailedUserResponse } from '../user/user-types';

class AuthStore {
  user: DetailedUserResponse | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(newUser: DetailedUserResponse) {
    this.user = newUser;
  }

  dropUser() {
    this.user = null;
  }
}

const authStore = new AuthStore();
export default authStore;

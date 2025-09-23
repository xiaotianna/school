import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'user',
  }),
  getters: {},
  actions: {},
});
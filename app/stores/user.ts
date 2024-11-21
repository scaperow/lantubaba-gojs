let user = ref<null | User>(null);

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
  }),
});

export interface User {
  id: number;
  name: string;
  mail: string;
  isVerified?: boolean;
}

export interface State {
  user: User | null;
}

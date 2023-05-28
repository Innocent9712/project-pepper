import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';


interface LoginState {
  login: boolean;
  session: string;
  setLogin: (newState: boolean) => void;
  setSession: (value: string) => void;
}


export const loginStore = create(persist<LoginState>((set) => ({
    login: false,
    session: "",
    setLogin: (newState: boolean) => set({ login: newState}),
    setSession: (value: string) => set({session: value})
}),
    {
        name: "login",
        storage: createJSONStorage(() => sessionStorage)
    }
))
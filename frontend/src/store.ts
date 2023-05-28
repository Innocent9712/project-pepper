import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';


interface LoginState {
  login: boolean;
  setLogin: (newState: boolean) => void;
}


export const loginStore = create(persist<LoginState>((set) => ({
    login: false,
    setLogin: (newState: boolean) => set({ login: newState})
}),
    {
        name: "login",
        storage: createJSONStorage(() => sessionStorage)
    }
))
import create from 'zustand';

interface UserState {
    login: boolean;
    userToken: string;
}

export const useStore = create<UserState>((set) => ({
    login: false,
    userToken: "",
    setLogin: () => set((state) => {
        return {login: !state}
    }),
    setUserToken: (userToken: string) => set(() => {
        return {userToken: userToken}
    })
}))

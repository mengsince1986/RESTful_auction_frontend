import create from 'zustand';


const getLocalStorage = (key: string)  => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: string) => window.localStorage.setItem(key, JSON.stringify(value));


interface TokenState {
    userToken: string;
    setUserToken: (userToken: string) => void;
}


const useStore = create<TokenState>((set) => ({
    userToken: getLocalStorage('userToken') || "",

    setUserToken: (userToken: string) => set(() => {
        setLocalStorage('userToken', userToken)
        return {userToken: userToken}
    }),

}))

export const useTokenStore = useStore;
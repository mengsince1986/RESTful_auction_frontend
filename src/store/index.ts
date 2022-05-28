import create from 'zustand';


const getLocalStorage = (key: string)  => JSON.parse(window.localStorage.getItem(key) as string);
const setLocalStorage = (key: string, value: string) => window.localStorage.setItem(key, JSON.stringify(value));


interface TokenState {
    userToken: string;
    setUserToken: (userToken: string) => void;
}


const useStore1 = create<TokenState>((set) => ({
    userToken: getLocalStorage('userToken') || "",

    setUserToken: (userToken: string) => set(() => {
        setLocalStorage('userToken', userToken)
        return {userToken: userToken}
    }),
}))

interface UserIdState {
    userId: string;
    setUserId: (userId: string) => void;
}

const useStore2 = create<UserIdState>((set) => ({
    userId: getLocalStorage('userId') || "",

    setUserId: (userId: string) => set(() => {
        setLocalStorage('userId', userId)
        return {userId: userId}
    }),
}))

export const useTokenStore = useStore1;
export const useUserIdStore = useStore2;
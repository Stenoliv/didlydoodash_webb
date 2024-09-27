import secureLocalStorage from "react-secure-storage";
import { StateStorage } from "zustand/middleware";

export const authStorage: StateStorage = {
    setItem: (name: string, value) => {
        return secureLocalStorage.setItem(name, value)
    } ,
    getItem: (name: string) => {
        const value = secureLocalStorage.getItem(name)?.toString();
		return value ?? null;
    },
    removeItem: (name: string) => {
        return secureLocalStorage.removeItem(name)
    }
}
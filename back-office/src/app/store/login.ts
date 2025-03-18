import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface UserState {
  name: string;
  role: string;
  id: string;
  setToken: (token: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<UserState>((set) => ({
  name: "",
  role: "",
  id: "",

  setToken: (token: string) => {
    const decoded: any = jwtDecode(token);
    set({ name: decoded.name, role: decoded.role, id: decoded.id });
  },

  clearUser: () => {
    sessionStorage.removeItem("token");
    set({ name: "", role: "", id: "" });
  },
}));

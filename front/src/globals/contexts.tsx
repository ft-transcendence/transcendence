import { createContext, useContext } from "react";
import { AuthContextType } from "./Interfaces";

export let AuthContext = createContext<AuthContextType>(null!);

export function useAuth() {
  return useContext(AuthContext);
}

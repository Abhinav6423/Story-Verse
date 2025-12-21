import { createContext, useContext } from "react";

const Authcontext = createContext();


export const useAuth = () => useContext(Authcontext);

export default Authcontext;
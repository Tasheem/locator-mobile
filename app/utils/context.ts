import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createContext } from "react";
import { RootStackParamList } from "../../App";
import { User } from "../models/user";

export const DrawerContext = createContext<DrawerNavigationProp<RootStackParamList, "HomeDrawer"> | null>(null);
export const UserContext = createContext<[User | null, React.Dispatch<React.SetStateAction<User | null>>]>([null, () => {}]);
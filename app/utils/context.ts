import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createContext } from "react";
import { RootStackParamList } from "../../App";

export const DrawerContext = createContext<DrawerNavigationProp<RootStackParamList, "HomeDrawer"> | null>(null);
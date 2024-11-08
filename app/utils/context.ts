import { DrawerNavigationProp } from "@react-navigation/drawer";
import { createContext } from "react";
import { RootStackParamList } from "../../App";
import { Blocked, User } from "../models/user";

const DrawerContext = createContext<DrawerNavigationProp<RootStackParamList, "HomeDrawer"> | null>(null);
const UserContext = createContext<[User | null, React.Dispatch<React.SetStateAction<User | null>>]>([null, () => {}]);
const ScreenContext = createContext({
    height: 0,
    width: 0,
    heightRatio: 1,
    widthRatio: 1
});

// key: id of the target user being blocked.
// value: the Blocked object containing all the information related to the blocking.
const BlockedContext = createContext<[Map<number, Blocked>, React.Dispatch<React.SetStateAction<Map<number, Blocked>>>]>([new Map(), () => {}]);

export { DrawerContext, UserContext, ScreenContext, BlockedContext };
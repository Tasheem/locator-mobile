import { useContext } from "react";
import { ScreenContext } from "../utils/context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../../App";
import { BRAND_RED } from "../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {}

export default function HamburgerMenu({}: Props) {
    const { widthRatio } = useContext(ScreenContext);
    const navigation = useNavigation<DrawerNavigationProp<RootStackParamList, 'HomeDrawer'>>();

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.toggleDrawer();
            }}
        >
            <Ionicons
                name='menu-outline'
                size={30 * widthRatio}
                style={{
                    marginLeft: 8 * widthRatio
                }}
                color={BRAND_RED}
            />
        </TouchableOpacity>
    );
}
import { Image } from "react-native";

type LogoProps = {
    height: number;
    width: number;
}

export default function Logo(props: LogoProps) {
    return (
        <Image style={{
            height: props.height,
            width: props.width
        }} source={require("../assets/locater_center_solid.png")} />
    )
}
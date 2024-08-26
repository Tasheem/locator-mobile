import { StyleSheet, Image } from "react-native";

export default function renderImage(uri: string, width: number, height: number) {
	if(!uri) {
		return (
			<Image source={{
				uri: uri
			}} />
		);
	}

	return (
		<Image style={{
            width: width,
            height: height,
        }} source={{
			uri: uri
		}} />
	);
}

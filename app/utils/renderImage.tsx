import { Image } from 'react-native';

export default function renderImage(uri: string, width: number, height: number) {
	console.log('URI:', uri);
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

import { ImagePickerAsset } from "expo-image-picker";
import { appConfig } from "../utils/config";
import { sendRequest } from "../utils/requestUtil";
import { Platform } from "react-native";
import { LocatorImageData } from "../models/locator-media";

const serverPrefix = `${appConfig.serverURL}/media`;
const fetchUserImages = () => {
    return sendRequest(`${serverPrefix}/image/user`);
}

const uploadImages = (assets: ImagePickerAsset[]) => {
    const formData = new FormData();
    let url = '';
    if(assets.length === 1) {
        url = `${serverPrefix}/image`;
        const asset = assets[0];

        // @ts-expect-error: special react native format for form data
        formData.append('image', {
            uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
            name: asset.fileName,
            type: asset.type ?? 'image'
        });
    } else {
        url = `${serverPrefix}/image/multiple`

        for(let index in assets) {
            const asset = assets[index];
            // @ts-expect-error: special react native format for form data
            formData.append(`images`, {
                uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
                name: asset.fileName,
                type: asset.type ?? 'image'
            });
        }
    }

    const options = {
        method: 'POST',
        body: formData
    } as RequestInit

    return sendRequest(url, options);
}

const deleteImage = (photo: LocatorImageData) => {
    const options = {
        method: 'DELETE',
        body: JSON.stringify(photo),
        headers: {
            'Content-Type': 'application/json'
        }
    } as RequestInit

    return sendRequest(`${serverPrefix}/image`, options);
}

const setProfilePicture = (photo: LocatorImageData) => {
    const options = {
        method: 'PUT',
        body: JSON.stringify(photo),
        headers: {
            'Content-Type': 'application/json'
        }
    } as RequestInit

    return sendRequest(`${serverPrefix}/image/user/profile/pic`, options);
}

export { fetchUserImages, uploadImages, deleteImage, setProfilePicture }
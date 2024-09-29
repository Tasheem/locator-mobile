const apiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

export async function geocode(address: string) {
    const urlEncodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${urlEncodedAddress}&key=${apiKey}`;
    
    return fetch(url);
}
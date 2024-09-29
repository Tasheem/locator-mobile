type GeocodeAPIResponse = {
    "results": GeocodeResult[],
    "status": string
}

type GeocodeResult = {
    "address_components": AddressComponent[]
    "formatted_address": string,
    "geometry": {
        "bounds": BoundingBox
        "location": Coordinates
        "location_type": string
        "viewport": ViewPort
    }
    "place_id": string
    "types": string[]
}

type AddressComponent = {
    "long_name": string
    "short_name": string
    "types": string[]
}

type BoundingBox = {
    "northeast"?: Coordinates
    "southwest"?: Coordinates
    "northwest"?: Coordinates
    "southeast"?: Coordinates
}

type ViewPort = {
    "northeast"?: Coordinates
    "southwest"?: Coordinates
    "northwest"?: Coordinates
    "southeast"?: Coordinates
}

type Coordinates = {
    "lat": number
    "lng": number
}

export { GeocodeAPIResponse, GeocodeResult, AddressComponent, BoundingBox, ViewPort, Coordinates }
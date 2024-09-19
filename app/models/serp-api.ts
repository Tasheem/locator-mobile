type SerpAPIResult = {
    'local_results': {
        'places': SerpPlace[]
    }
}

type SerpPlace = {
    'position': number
    'title': string
    'place_id': string
    'lsig': string
    'place_id_search': string
    'reviews': number,
    'price': string,
    'type': string,
    'address': string,
    'thumbnail': string
    'gps_coordinates': SerpGPS
}

type SerpGPS = {
    'latitude': number
    'longitude': number
}

export { SerpAPIResult };
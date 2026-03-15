/**
 * Geocode a place name to lat/lng using OpenStreetMap Nominatim (free, no API key needed)
 */
export async function geocode(placeName) {
    if (!placeName) return null;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}&limit=1`,
            {
                headers: {
                    'User-Agent': 'MyTravelList/1.0',
                },
            }
        );

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * Geocode a place name to lat/lng via our server-side proxy (avoids CORS issues with Nominatim)
 */
export async function geocode(placeName) {
    if (!placeName) return null;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(
            `/api/geocode?q=${encodeURIComponent(placeName)}`,
            {
                signal: controller.signal,
            }
        );
        clearTimeout(timeoutId);

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

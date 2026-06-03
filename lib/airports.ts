import airports from 'airports';

export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
  lat?: number;
  lon?: number;
}

/**
 * Get airport information by IATA code
 * @param code - Airport IATA code (e.g., 'DEL', 'DXB', 'JFK')
 * @returns Airport information or fallback with code
 */
export function getAirportInfo(code: string): AirportInfo {
  try {
    if (!code || typeof code !== 'string') {
      return {
        code: code || '---',
        name: 'Unknown Airport',
        city: '',
        country: '',
      };
    }

    const airport = (airports as any)[code.toUpperCase()];

    if (!airport) {
      return {
        code: code.toUpperCase(),
        name: `${code.toUpperCase()} Airport`,
        city: '',
        country: '',
      };
    }

    return {
      code: code.toUpperCase(),
      name: airport.name || `${code.toUpperCase()} Airport`,
      city: airport.city || '',
      country: airport.country || '',
      lat: airport.lat,
      lon: airport.lon,
    };
  } catch (error) {
    console.error(`Error fetching airport info for ${code}:`, error);
    return {
      code: code?.toUpperCase() || '---',
      name: `${code?.toUpperCase() || '---'} Airport`,
      city: '',
      country: '',
    };
  }
}

/**
 * Get airport city name by code
 * @param code - Airport IATA code
 * @returns City name or empty string
 */
export function getAirportCity(code: string): string {
  const airport = getAirportInfo(code);
  return airport.city || airport.name;
}

/**
 * Get formatted airport display name (City - Code)
 * @param code - Airport IATA code
 * @returns Formatted display name
 */
export function getAirportDisplayName(code: string): string {
  const airport = getAirportInfo(code);
  if (airport.city) {
    return `${airport.city} (${airport.code})`;
  }
  return airport.code;
}

/**
 * Get flight route display (City1 → City2)
 * @param originCode - Origin airport code
 * @param destinationCode - Destination airport code
 * @returns Formatted route display
 */
export function getFlightRouteDisplay(originCode: string, destinationCode: string): string {
  const originCity = getAirportCity(originCode);
  const destCity = getAirportCity(destinationCode);
  return `${originCity} → ${destCity}`;
}

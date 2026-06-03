/**
 * Client-side airline utilities (no heavy dependencies)
 * For full airline name resolution, use backend airline service
 */

export interface AirlineInfo {
  code: string;
  name: string;
  logo: {
    kiwi: string;
  };
}

/**
 * Get airline logo URL by IATA code
 * @param iataCode - Airline IATA code (e.g., 'UA', 'BA', 'AI')
 * @returns Airline logo URL
 */
export function getAirlineLogoUrl(iataCode: string): string {
  if (!iataCode || typeof iataCode !== 'string') {
    return '';
  }
  const upperCode = iataCode.toUpperCase();
  return `https://images.kiwi.com/airlines/64/${upperCode}.png`;
}

/**
 * Get airline name by code (fallback to code if not known)
 * @param iataCode - Airline IATA code
 * @returns Airline name or code
 */
export function getAirlineName(iataCode: string): string {
  if (!iataCode || typeof iataCode !== 'string') {
    return 'Unknown Airline';
  }
  return iataCode.toUpperCase();
}

/**
 * Get airline info (client-side fallback - uses backend for full data)
 * @param iataCode - Airline IATA code
 * @returns Basic airline information
 */
export function getAirlineInfo(iataCode: string): AirlineInfo {
  if (!iataCode || typeof iataCode !== 'string') {
    return {
      code: '---',
      name: 'Unknown Airline',
      logo: {
        kiwi: '',
      },
    };
  }

  const upperCode = iataCode.toUpperCase();
  return {
    code: upperCode,
    name: upperCode,
    logo: {
      kiwi: getAirlineLogoUrl(upperCode),
    },
  };
}

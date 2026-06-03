import airlines from 'airline-codes';

export interface AirlineInfo {
  code: string;
  name: string;
  logo: {
    kiwi: string;
  };
}

/**
 * Get airline information by IATA code
 * @param iataCode - Airline IATA code (e.g., 'UA', 'BA', 'AI')
 * @returns Airline information with logo URLs
 */
export function getAirlineInfo(iataCode: string): AirlineInfo {
  try {
    if (!iataCode || typeof iataCode !== 'string') {
      return {
        code: iataCode || '---',
        name: 'Unknown Airline',
        logo: {
          kiwi: '',
        },
      };
    }

    const upperCode = iataCode.toUpperCase();
    
    // Try to find airline using airline-codes
    let airlineName = upperCode;
    try {
      // airline-codes uses different methods depending on version
      // Try different approaches for compatibility
      const airline = (airlines as any)[upperCode] || 
                     (airlines as any).get?.(upperCode) ||
                     (airlines as any).findWhere?.({ iata: upperCode })?.get?.('name');
      
      if (airline) {
        airlineName = typeof airline === 'string' ? airline : airline.name || upperCode;
      }
    } catch (e) {
      // Fallback to code if airline-codes lookup fails
      airlineName = upperCode;
    }

    return {
      code: upperCode,
      name: airlineName,
      logo: {
        kiwi: `https://images.kiwi.com/airlines/64/${upperCode}.png`,
      },
    };
  } catch (error) {
    console.error(`Error fetching airline info for ${iataCode}:`, error);
    return {
      code: iataCode?.toUpperCase() || '---',
      name: iataCode?.toUpperCase() || 'Unknown Airline',
      logo: {
        kiwi: '',
      },
    };
  }
}

/**
 * Get airline name by code
 * @param iataCode - Airline IATA code
 * @returns Airline name
 */
export function getAirlineName(iataCode: string): string {
  const airline = getAirlineInfo(iataCode);
  return airline.name;
}

/**
 * Get airline logo URL
 * @param iataCode - Airline IATA code
 * @returns Logo URL
 */
export function getAirlineLogoUrl(iataCode: string): string {
  const airline = getAirlineInfo(iataCode);
  return airline.logo.kiwi;
}

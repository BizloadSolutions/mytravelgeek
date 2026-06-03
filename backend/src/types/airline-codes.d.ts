/**
 * Type declarations for airline-codes module
 */
declare module 'airline-codes' {
  interface AirlineEntry {
    [key: string]: string | AirlineData;
  }

  interface AirlineData {
    name?: string;
    iata?: string;
    icao?: string;
  }

  const airlines: AirlineEntry;
  export default airlines;
}

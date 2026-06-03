/**
 * Type declarations for airports module
 */
declare module 'airports' {
  interface AirportData {
    name: string;
    city: string;
    country: string;
    code: string;
    lat?: number;
    lon?: number;
  }

  interface AirportsDatabase {
    [iataCode: string]: AirportData;
  }

  const airports: AirportsDatabase;
  export default airports;
}

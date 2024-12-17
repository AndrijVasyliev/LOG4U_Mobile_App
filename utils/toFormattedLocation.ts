import * as Location from 'expo-location';

export const toFormattedLocation = (
  geocodedResult: Location.LocationGeocodedAddress,
): string => {
  try {
    const city = `${geocodedResult.city ? geocodedResult.city : ''}`;
    const region = `${geocodedResult.region ? geocodedResult.region : ''}`;
    const country = `${geocodedResult.country ? geocodedResult.country : ''}`;
    const postalCode = `${geocodedResult.postalCode ? geocodedResult.postalCode : ''}`;
    let res = city;
    if (!res) {
      res = res + `${res && region ? ', ' : ''}` + region;
      res = res + `${res && country ? ', ' : ''}` + country;
    }
    res = res + `${res && postalCode ? ', ' : ''}` + postalCode;
    return res;
  } catch (error) {
    return '';
  }
};

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as Location from 'expo-location';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import {
  // BACKEND_ORIGIN,
  COLORS,
  FETCH_TIMEOUT,
  GEOCODING_THROTTLE_INTERVAL,
  GOOGLE_PLACES_API,
  GOOGLE_RESPONSE_TYPE,
  // SET_LOCATION_PATH
} from '../../constants';
import { throttle } from '../../utils/throttle';
import { getGoogleApiKey } from '../../utils/getGoogleApiKey';

/*const toFormattedAddress = (
  geocodedResult: Location.LocationGeocodedAddress,
): string => {
  try {
    const street = `${geocodedResult.street ? geocodedResult.street : ''}`;
    const streetNumber = `${geocodedResult.streetNumber ? geocodedResult.streetNumber : ''}`;
    const city = `${geocodedResult.city ? geocodedResult.city : ''}`;
    const region = `${geocodedResult.region ? geocodedResult.region : ''}`;
    const country = `${geocodedResult.country ? geocodedResult.country : ''}`;
    const postalCode = `${geocodedResult.postalCode ? geocodedResult.postalCode : ''}`;
    let res = street + `${street && streetNumber ? ', ' : ''}` + streetNumber;
    res = res + `${res && city ? ', ' : ''}` + city;
    if (city != region) {
      res = res + `${res && region ? ', ' : ''}` + region;
    }
    res = res + `${res && country ? ', ' : ''}` + country;
    res = res + `${res && postalCode ? ', ' : ''}` + postalCode;
    return res;
  } catch (error) {
    return '';
  }
};*/

const LocationInput = ({ onSet }: { onSet: (newValue: string) => void }) => {
  const [locationOpen, setLocationOpen] = React.useState<boolean>(false);
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false);
  const [locationValue, setLocationValue] = React.useState<string>('');
  const [locationSearchValue, setLocationSearchValue] =
    React.useState<string>('');
  const [locationItems, setLocationItems] = React.useState<ItemType<string>[]>(
    [],
  );

  React.useEffect(() => {
    if (!locationOpen && !Number.isNaN(locationValue)) {
      onSet(locationValue);
      /*const selected = locationItems.find(
        (item) => item.value === locationValue,
      );
      const value =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        selected?.coordsElement &&
        ([
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          selected.coordsElement.latitude as number,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          selected.coordsElement.longitude as number,
        ] as [number, number]);
      onSet(value);*/
    }
  }, [locationOpen]);

  React.useEffect(() => {
    setLocationValue('');
  }, [locationItems]);

  React.useEffect(() => {
    throttledSearch(locationSearchValue);
  }, [locationSearchValue]);

  const handleSearchChange = (value: string) => {
    if (!value) {
      return;
    }
    setLocationLoading(true);
    const uri = new URL(GOOGLE_RESPONSE_TYPE, GOOGLE_PLACES_API);
    uri.searchParams.set('input', value);
    uri.searchParams.set('key', getGoogleApiKey());
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const init = {
      method: 'GET',
      signal: controller.signal,
    };
    console.log(
      `Getting Places for ${uri.toString()}: ${JSON.stringify(init)}`,
    );
    fetch(uri, init)
      .then((response) => {
        if (!response || response.status !== 200) {
          throw new Error('Incorrect or no response');
        }
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        console.log(JSON.stringify(response.predictions));
        const locationItems = [];
        response?.predictions?.forEach((place) =>
          locationItems.push({
            label: place.description,
            value: place.place_id,
          }),
        );
        setLocationItems(locationItems);
      })
      .catch((error) => {
        console.log('Error getting Places', error);
        setLocationItems([]);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLocationLoading(false);
      });
  };

  /*const handleSearchChange = (value: string) => {
    setLocationLoading(true);
    Location.geocodeAsync(value)
      .then((value) => {
        if (value && value.length) {
          return Promise.all(
            value
              .filter(
                (coordsElement) =>
                  Number.isFinite(coordsElement?.latitude) &&
                  Number.isFinite(coordsElement?.longitude),
              )
              .map(
                (coordsElement) =>
                  new Promise((resolve, reject) => {
                    Location.reverseGeocodeAsync(coordsElement)
                      .then((result) => {
                        resolve(
                          result
                            .filter((geocodedResult) => geocodedResult)
                            .map((geocodedResult) => ({
                              coordsElement,
                              geocodedResult,
                            })),
                        );
                      })
                      .catch((error) => reject(error));
                  }),
              ),
          );
        } /!* else {
          setLocationItems([]);
        }
        setLocationLoading(false);*!/
      })
      .then((res) => {
        if (res && res.length) {
          let locationItems = [];
          try {
            locationItems = res
              .flat(1)
              .filter((element) => element)
              .map(
                (
                  element: {
                    coordsElement: Location.LocationGeocodedLocation;
                    geocodedResult: Location.LocationGeocodedAddress;
                  },
                  index,
                ) => ({
                  ...element,
                  label: element?.geocodedResult
                    ? toFormattedAddress(element.geocodedResult)
                    : '',
                  value: index,
                }),
              );
          } catch (error) {
            /!* empty *!/
          }
          setLocationItems(locationItems);
        } else {
          setLocationItems([]);
        }
        setLocationLoading(false);
      })
      .catch(() => {
        setLocationItems([]);
        setLocationLoading(false);
      });
  };*/

  const throttledSearch = React.useMemo(
    () => throttle(handleSearchChange, GEOCODING_THROTTLE_INTERVAL),
    [],
  );

  return (
    <View style={styles.container}>
      <DropDownPicker<string>
        disableBorderRadius={false}
        modalAnimationType="slide"
        dropDownDirection={Platform.OS === 'ios' ? 'TOP' : 'BOTTOM'}
        placeholder="Select Location"
        translation={{
          SEARCH_PLACEHOLDER: 'Start to enter location',
          NOTHING_TO_SHOW: 'No location found',
        }}
        searchPlaceholderTextColor={COLORS.gray2}
        disableLocalSearch={true}
        onChangeSearchText={setLocationSearchValue}
        style={styles.dropdown}
        textStyle={styles.text}
        containerStyle={styles.dropdownControlContainer}
        disabledStyle={styles.dropdownDisabled}
        placeholderStyle={styles.dropdownPlaceholder}
        dropDownContainerStyle={styles.dropdownContainer}
        searchContainerStyle={styles.dropdownSearchContainer}
        searchTextInputStyle={styles.dropdownSearch}
        listMode="SCROLLVIEW"
        labelProps={{
          numberOfLines: 2,
        }}
        scrollViewProps={{
          persistentScrollbar: true,
        }}
        ArrowUpIconComponent={() => (
          <MaterialCommunityIcons
            name="menu-up"
            color={COLORS.black}
            size={24}
          />
        )}
        ArrowDownIconComponent={() => (
          <MaterialCommunityIcons
            name="menu-down"
            color={COLORS.black}
            size={24}
          />
        )}
        TickIconComponent={() => (
          <MaterialCommunityIcons name="check" color={COLORS.black} size={24} />
        )}
        disabled={false}
        searchable={true}
        open={locationOpen}
        loading={locationLoading}
        value={locationValue}
        items={locationItems}
        setOpen={setLocationOpen}
        setValue={setLocationValue}
        setItems={setLocationItems}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    marginTop: 5,
    width: '100%',
  },
  dropdown: {
    backgroundColor: COLORS.unset,
    borderWidth: 0,
  },
  dropdownContainer: {
    backgroundColor: COLORS.lightWhite,
    borderColor: COLORS.gray,
    height: 125,
  },
  dropdownControlContainer: {
    width: '100%',
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownPlaceholder: {
    color: COLORS.gray2,
  },
  dropdownSearch: {
    borderColor: COLORS.gray,
  },
  dropdownSearchContainer: {
    borderBottomColor: COLORS.gray3,
  },
  text: {},
});

export default LocationInput;

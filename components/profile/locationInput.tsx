import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { COLORS } from '../../constants';

const toFormattedAddress = (
  geocodedResult: Location.LocationGeocodedAddress,
): string => {
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
};

const LocationInput = ({
  onSet,
}: {
  onSet: (newValue: [number, number]) => void;
}) => {
  const [locationOpen, setLocationOpen] = React.useState<boolean>(false);
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false);
  const [locationValue, setLocationValue] = React.useState<number>(NaN);
  const [locationItems, setLocationItems] = React.useState<ItemType<number>[]>(
    [],
  );

  React.useEffect(() => {
    if (!locationOpen && !Number.isNaN(locationValue)) {
      const selected = locationItems.find(
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
      onSet(value);
    }
  }, [locationOpen]);

  const handleSearchChange = (value: string) => {
    setLocationLoading(true);
    Location.geocodeAsync(value)
      .then((value) => {
        if (value && value.length) {
          return Promise.all(
            value.map(
              (coordsElement) =>
                new Promise((resolve, reject) => {
                  Location.reverseGeocodeAsync(coordsElement)
                    .then((result) => {
                      resolve(
                        result.map((geocodedResult) => ({
                          coordsElement,
                          geocodedResult,
                        })),
                      );
                    })
                    .catch((error) => reject(error));
                }),
            ),
          );
        } else {
          setLocationItems([]);
        }
        setLocationLoading(false);
      })
      .then((res) => {
        if (res && res.length) {
          setLocationItems(
            res.flat(1).map(
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
            ),
          );
        } else {
          setLocationItems([]);
        }
        setLocationLoading(false);
      })
      .catch(() => setLocationItems([]));
  };

  return (
    <View style={styles.container}>
      <DropDownPicker<number>
        disableBorderRadius={false}
        modalAnimationType="slide"
        placeholder="Select Location"
        translation={{
          SEARCH_PLACEHOLDER: 'Start to enter location',
          NOTHING_TO_SHOW: 'No location found',
        }}
        searchPlaceholderTextColor={COLORS.gray2}
        disableLocalSearch={true}
        onChangeSearchText={handleSearchChange}
        style={styles.dropdown}
        containerStyle={styles.dropdownControlContainer}
        disabledStyle={styles.dropdownDisabled}
        placeholderStyle={styles.dropdownPlaceholder}
        dropDownContainerStyle={styles.dropdownContainer}
        searchContainerStyle={styles.dropdownSearchContainer}
        searchTextInputStyle={styles.dropdownSearch}
        listMode="FLATLIST"
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
    zIndex: 1,
  },
  dropdown: {
    backgroundColor: COLORS.unset,
    borderWidth: 0,
  },
  dropdownContainer: {
    backgroundColor: COLORS.lightWhite,
    borderColor: COLORS.gray,
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
});

export default LocationInput;

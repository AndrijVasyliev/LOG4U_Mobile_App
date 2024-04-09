import * as React from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';

import WillBeAvailableDialog from './WillBeAvailDialog';
import UserDataItem from './UserDataItem';
import FileList from './fileList';
import { BACKEND_ORIGIN, COLORS, UPDATE_TRUCK_PATH } from '../../constants';
import { authFetch } from '../../utils/authFetch';

const truckStatuses = ['Will be available', 'Available', 'Not Available'];

const toFormattedLocation = (
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

const Profile = ({
  truck,
  expanded = true,
  onChanged = () => {},
}: {
  truck?: Record<string, any>;
  expanded?: boolean;
  onChanged?: (number) => void;
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [willBeDialogVisible, setWillBeDialogVisible] =
    React.useState<boolean>(false);

  const [statusOpen, setStatusOpen] = React.useState<boolean>(false);
  const [statusValue, setStatusValue] = React.useState<string>('');
  const [statusItems, setStatusItems] = React.useState<
    { label: string; value: string }[]
  >(truckStatuses.map((status) => ({ label: status, value: status })));
  const [locationName, setLocationName] = React.useState<string>('');

  React.useEffect(() => {
    if (truck && truck.availabilityLocation) {
      Location.reverseGeocodeAsync({
        latitude: truck.availabilityLocation[0],
        longitude: truck.availabilityLocation[1],
      }).then(
        (geocodeRes) => setLocationName(toFormattedLocation(geocodeRes[0])),
        () => setLocationName(''),
      );
    } else {
      setLocationName('');
    }
  }, [truck]);

  React.useEffect(() => {
    const statusFromProfile = truck ? truck.status : '';
    if (statusFromProfile && !truckStatuses.includes(statusFromProfile)) {
      setStatusItems(
        [...truckStatuses, statusFromProfile].map((status) => ({
          label: status,
          value: status,
        })),
      );
    } else {
      setStatusItems(
        truckStatuses.map((status) => ({
          label: status,
          value: status,
        })),
      );
    }
    setStatusValue(statusFromProfile);
  }, [truck]);

  React.useEffect(() => {
    const statusFromProfile = truck && truck.status;
    if (statusFromProfile === statusValue) {
      return;
    }
    if (statusValue === 'Available' || statusValue === 'Not Available') {
      handleChangeState(statusValue);
    } else if (statusValue === 'Will be available') {
      setWillBeDialogVisible(true);
    }
  }, [statusValue]);

  React.useEffect(() => {
    if (!expanded) {
      setStatusOpen(false);
    }
  }, [expanded]);

  const handleChangeState = (
    value: string,
    availabilityLocation?: [number, number],
    availabilityAt?: Date,
  ) => {
    setIsLoading(true);
    const data: {
      status: string;
      availabilityLocation?: [number, number];
      availabilityAt?: Date;
    } = {
      status: value,
      availabilityLocation,
      availabilityAt,
    };
    authFetch(new URL(`${UPDATE_TRUCK_PATH}/${truck.id}`, BACKEND_ORIGIN), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
      .then(() => {
        setIsLoading(false);
        onChanged(Date.now());
      })
      .catch(() => {
        setIsLoading(false);
        onChanged(Date.now());
      });
  };

  const handleStateChange = (
    value: string,
    availabilityLocation?: [number, number],
    availabilityAt?: Date,
  ) => {
    handleChangeState(value, availabilityLocation, availabilityAt);
    setWillBeDialogVisible(false);
  };
  const handleWillBeDialogClose = () => {
    setWillBeDialogVisible(false);
    onChanged(Date.now());
  };

  return (
    <>
      <WillBeAvailableDialog
        visible={willBeDialogVisible}
        onStateChange={handleStateChange}
        close={handleWillBeDialogClose}
      />
      <UserDataItem
        iconName="account"
        value={`${truck?.driver?.fullName ? truck.driver.fullName : ''}`}
        fieldName="Driver"
      />
      {!expanded ? null : (
        <UserDataItem
          iconName="email"
          value={`${truck?.driver?.email ? truck.driver.email : ''}`}
          fieldName="Email"
        />
      )}
      {!expanded ? null : (
        <UserDataItem
          iconName="phone"
          value={`${truck?.driver?.phone ? truck.driver.phone : ''}`}
          fieldName="Phone"
        />
      )}
      <FileList
        objectId={truck?.driver?.id}
        objectType="Person"
        caption="Person`s docs"
      />
      <UserDataItem
        iconName="truck"
        value={`${truck ? truck.truckNumber : ''}`}
        fieldName="Truck #"
      />
      {!expanded ? null : (
        <UserDataItem
          iconName="message-cog"
          value={`${truck ? truck.vinCode : ''}`}
          fieldName="VINCODE"
        />
      )}
      {!expanded ? null : (
        <View style={styles.controlContainer}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons
              name="truck-fast"
              color={COLORS.black}
              size={24}
            />
            <DropDownPicker
              disableBorderRadius={false}
              placeholder="Select state"
              style={styles.dropdown}
              containerStyle={styles.dropdownControlContainer}
              disabledStyle={styles.dropdownDisabled}
              dropDownContainerStyle={styles.dropdownContainer}
              listMode="SCROLLVIEW"
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
                <MaterialCommunityIcons
                  name="check"
                  color={COLORS.black}
                  size={24}
                />
              )}
              dropDownDirection="TOP"
              disabled={!truckStatuses.includes(statusValue)}
              open={statusOpen}
              value={statusValue}
              items={statusItems}
              setOpen={setStatusOpen}
              setValue={setStatusValue}
              setItems={setStatusItems}
            />
          </View>
          <Text>Truck status</Text>
        </View>
      )}
      {expanded && truck && truck.status === 'Will be available' && (
        <>
          <UserDataItem
            iconName="map-marker"
            value={locationName}
            fieldName="Will be location"
          />
          <UserDataItem
            iconName="timeline-clock"
            value={`${
              truck ? new Date(truck.availabilityAt).toDateString() : ''
            }`}
            fieldName="Will be at"
          />
        </>
      )}
      <FileList
        objectId={truck?.id}
        objectType="Truck"
        caption="Truck`s docs"
      />
      <Spinner visible={isLoading} textContent={'Updating truck...'} />
    </>
  );
};

const styles = StyleSheet.create({
  controlContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
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
    width: 160,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default Profile;

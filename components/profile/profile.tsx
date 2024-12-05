import * as React from 'react';
import * as Location from 'expo-location';
import { Text, View, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';

import WillBeAvailableDialog from './WillBeAvailDialog';
import UserDataItem from '../common/UserDataItem';
import FileList from '../file/fileList';
import { BACKEND_ORIGIN, COLORS, TRUCK_PATH } from '../../constants';
import { useFetch } from '../../hooks/useFetch';
import { toFormattedLocation } from '../../utils/toFormattedLocation';
import { fromISOCorrected } from '../../utils/dateTimeConverters';
import { dateTimeFormatter } from '../../utils/dateTimeFormatters';
import LastLocationDialog from './LastLocationDialog';
import IconButton from '../common/IconButton';

const truckStatuses = ['Will be available', 'Available', 'Not Available'];

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
  const [lastLocationDialogVisible, setLastLocationDialogVisible] =
    React.useState<boolean>(false);

  const [statusOpen, setStatusOpen] = React.useState<boolean>(false);
  const [statusValue, setStatusValue] = React.useState<string>('');
  const [statusItems, setStatusItems] = React.useState<
    { label: string; value: string }[]
  >(truckStatuses.map((status) => ({ label: status, value: status })));
  const [locationName, setLocationName] = React.useState<string>('');
  const [willBeLocationName, setWillBeLocationName] =
    React.useState<string>('');

  const authFetch = useFetch();

  const geocodeLastLocation = React.useCallback(
    (() => {
      let isRunning = false;
      return () => {
        if (isRunning) {
          return;
        } else {
          isRunning = true;
        }
        Location.reverseGeocodeAsync({
          latitude: truck.lastLocation[0],
          longitude: truck.lastLocation[1],
        }).then(
          (geocodeRes) => {
            isRunning = false;
            setLocationName(toFormattedLocation(geocodeRes[0]));
          },
          () => {
            isRunning = false;
            setLocationName('');
          },
        );
      };
    })(),
    [truck],
  );

  React.useEffect(() => {
    if (expanded && truck && truck.lastLocation) {
      geocodeLastLocation();
    } else {
      setLocationName('');
    }
  }, [truck]);

  React.useEffect(() => {
    if (expanded && !locationName && truck && truck.lastLocation) {
      geocodeLastLocation();
    }
  }, [expanded]);

  const geocodeAvailabilityLocation = React.useCallback(
    (() => {
      let isRunning = false;
      return () => {
        if (isRunning) {
          return;
        } else {
          isRunning = true;
        }
        Location.reverseGeocodeAsync({
          latitude: truck.availabilityLocation[0],
          longitude: truck.availabilityLocation[1],
        }).then(
          (geocodeRes) => {
            isRunning = false;
            setWillBeLocationName(toFormattedLocation(geocodeRes[0]));
          },
          () => {
            isRunning = false;
            setWillBeLocationName('');
          },
        );
      };
    })(),
    [truck],
  );

  React.useEffect(() => {
    if (expanded && truck && truck.availabilityLocation) {
      geocodeAvailabilityLocation();
    } else {
      setLocationName('');
    }
  }, [truck]);

  React.useEffect(() => {
    if (
      expanded &&
      !willBeLocationName &&
      truck &&
      truck.availabilityLocation
    ) {
      geocodeAvailabilityLocation();
    }
  }, [expanded]);

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
    availabilityAtLocal?: Date,
  ) => {
    setIsLoading(true);
    const data: {
      status: string;
      availabilityLocation?: [number, number];
      availabilityAtLocal?: Date;
    } = {
      status: value,
      availabilityLocation,
      availabilityAtLocal,
    };
    authFetch(new URL(`${TRUCK_PATH}/${truck.id}`, BACKEND_ORIGIN), {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).finally(() => {
      setIsLoading(false);
      setTimeout(() => onChanged(Date.now()), 1);
    });
  };

  const handleWillBeAvailableSet = (
    value: string,
    availabilityLocation?: [number, number],
    availabilityAtLocal?: Date,
  ) => {
    handleChangeState(value, availabilityLocation, availabilityAtLocal);
    setWillBeDialogVisible(false);
  };
  const handleWillBeDialogClose = () => {
    setWillBeDialogVisible(false);
    onChanged(Date.now());
  };
  const handleLastLocationSet = (lastLocation: [number, number]) => {
    setIsLoading(true);
    const data: {
      lastLocation: [number, number];
    } = {
      lastLocation,
    };
    authFetch(new URL(`${TRUCK_PATH}/${truck.id}`, BACKEND_ORIGIN), {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).finally(() => {
      setIsLoading(false);
      setTimeout(() => onChanged(Date.now()), 1);
    });
    setLastLocationDialogVisible(false);
  };
  const handleLastLocationDialogShow = () => {
    setLastLocationDialogVisible(true);
  };
  const handleLastLocationDialogClose = () => {
    setLastLocationDialogVisible(false);
    onChanged(Date.now());
  };

  return (
    <>
      <WillBeAvailableDialog
        visible={willBeDialogVisible}
        onStateChange={handleWillBeAvailableSet}
        close={handleWillBeDialogClose}
      />
      <LastLocationDialog
        visible={lastLocationDialogVisible}
        onStateChange={handleLastLocationSet}
        close={handleLastLocationDialogClose}
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
      {!expanded ? null : (
        <FileList
          objectId={truck?.driver?.id}
          objectType="Person"
          label="Person`s docs"
        />
      )}
      <UserDataItem
        iconName="truck"
        value={`${truck ? truck.truckNumber : ''}`}
        fieldName="Truck #"
      />
      {expanded && (
        <View style={styles.setLocationContainer}>
          <IconButton
            iconName="map-marker-plus-outline"
            onClick={handleLastLocationDialogShow}
          />
        </View>
      )}
      {expanded && truck && (
        <>
          <UserDataItem
            iconName="map-marker"
            value={locationName}
            fieldName="Current location"
          />
        </>
      )}
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
              modalAnimationType="slide"
              dropDownDirection="TOP"
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
            iconName="map-marker-path"
            value={willBeLocationName}
            fieldName="Will be location"
          />
          <UserDataItem
            iconName="timeline-clock"
            value={`${
              truck && truck.availabilityAtLocal
                ? dateTimeFormatter.format(
                    fromISOCorrected(truck.availabilityAtLocal),
                  )
                : ''
            }`}
            fieldName="Will be at"
          />
        </>
      )}
      {!expanded ? null : (
        <FileList objectId={truck?.id} objectType="Load" label="Truck`s docs" />
      )}
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
  setLocationContainer: {
    position: 'relative',
    top: -32,
    marginBottom: -25,
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default Profile;

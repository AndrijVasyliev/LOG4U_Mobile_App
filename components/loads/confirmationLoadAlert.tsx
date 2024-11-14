import * as React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { BACKEND_ORIGIN, COLORS, LOAD_PATH } from '../../constants';
import ModalButton from '../common/modalButton';
import { authFetch } from '../../utils/authFetch';

const ConfirmationLoadAlert = ({
  load,
  expanded = false,
  onChanged = () => {},
}: {
  load: Record<string, any>;
  expanded?: boolean;
  onChanged?: (number) => void;
}) => {
  const [alertData, setAlertData] = React.useState<{
    alertText: string;
    stopType: 'PickUp' | 'Delivery';
    stopId: string;
    nextStatus: string;
  } | void>(undefined);
  const [acceptLoading, setAcceptLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      expanded &&
      !alertData &&
      load.status === 'In Progress' &&
      load.stops[0].status === 'New'
    ) {
      setTimeout(() => {
        setAlertData({
          alertText: `New Load#${load.loadNumber} has been assigned`,
          stopType: 'PickUp',
          stopId: load.stops[0].stopId,
          nextStatus: 'On route to PU',
        });
      }, 200);
    } else if (
      expanded &&
      !alertData &&
      load.status === 'In Progress' &&
      load.stops.find((stop) => stop.status === 'GTG')
    ) {
      const gtgStopIndex = load.stops.findIndex(
        (stop) => stop.status === 'GTG',
      );
      const stop = load.stops[gtgStopIndex];
      setTimeout(() => {
        setAlertData({
          alertText: `You are good to go from Stop#${gtgStopIndex + 1} on Load#${load.loadNumber}`,
          stopType: stop.type,
          stopId: stop.stopId,
          nextStatus: 'Completed',
        });
      }, 200);
    } else if (!expanded && alertData) {
      setAlertData(undefined);
    }
  }, [expanded, load]);

  const handleAcceptLoad = () => {
    if (!alertData) {
      return;
    }
    setAcceptLoading(true);
    const data: {
      status: string;
    } = {
      status: alertData.nextStatus,
    };
    authFetch(
      new URL(
        `${LOAD_PATH}/${load.id}/stop${alertData.stopType}/${alertData.stopId}`,
        BACKEND_ORIGIN,
      ),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    ).finally(() => {
      setAcceptLoading(false);
      setAlertData(undefined);
      setTimeout(() => onChanged(Date.now()), 1);
    });
  };

  return (
    <Modal
      animated={false}
      hardwareAccelerated={true}
      animationType="none"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={!!alertData}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <View style={styles.dialogContents}>
            <Text>{alertData ? alertData.alertText : ''}</Text>
          </View>
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
            <ModalButton
              text={'Confirm'}
              disabled={false}
              onPress={handleAcceptLoad}
            />
          </View>
        </View>
      </View>
      <Spinner visible={acceptLoading} textContent={'Accepting load...'} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  area: {
    backgroundColor: COLORS.modalBackground,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
    zIndex: 1,
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: 130,
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '90%',
  },
  spacer: {
    height: 10,
  },
});

export default ConfirmationLoadAlert;

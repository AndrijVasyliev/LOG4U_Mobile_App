import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { BACKEND_ORIGIN, LOAD_PATH } from '../../constants';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import Spacer from '../common/Spacer';
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
      setAlertData({
        alertText: `New Load#${load.loadNumber} has been assigned`,
        stopType: 'PickUp',
        stopId: load.stops[0].stopId,
        nextStatus: 'On route to PU',
      });
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
      setAlertData({
        alertText: `You are good to go from Stop#${gtgStopIndex + 1} on Load#${load.loadNumber}`,
        stopType: stop.type,
        stopId: stop.stopId,
        nextStatus: 'Completed',
      });
    } else if (!expanded && alertData) {
      setAlertData(undefined);
    }
  }, [expanded, load]);

  const handleAcceptLoad = () => {
    if (!alertData) {
      return;
    }
    setAlertData(undefined);
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
      setTimeout(() => onChanged(Date.now()), 1);
    });
  };

  return (
    <>
      <Modal
        visible={!!alertData}
        header={<Text>{'Please confim'}</Text>}
        contents={
          <View style={styles.dialogContentsHolder}>
            <Spacer />
            <Text style={styles.text}>
              {alertData ? alertData.alertText : ''}
            </Text>
            <Spacer />
          </View>
        }
        buttons={
          <ModalButton
            text={'Confirm'}
            disabled={false}
            onPress={handleAcceptLoad}
          />
        }
        close={() => {}}
      />
      <Spinner visible={acceptLoading} textContent={'Accepting load...'} />
    </>
  );
};

const styles = StyleSheet.create({
  dialogContentsHolder: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 'auto',
    width: '100%',
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
    minWidth: '70%',
  },
});

export default ConfirmationLoadAlert;

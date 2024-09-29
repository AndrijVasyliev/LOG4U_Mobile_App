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

const AcceptLoadAlert = ({
  visible,
  load,
  onChanged = () => {},
}: {
  visible: boolean;
  load: Record<string, any>;
  onChanged?: (number) => void;
}) => {
  const [acceptLoading, setAcceptLoading] = React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(visible);

  React.useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleAcceptLoad = () => {
    setAcceptLoading(true);
    const stops = load.stops as { stopId: string }[];
    const firstStopId = stops[0].stopId;
    const data: {
      status: string;
    } = {
      status: 'On route to PU',
    };
    authFetch(
      new URL(
        `${LOAD_PATH}/${load.id}/stopPickUp/${firstStopId}`,
        BACKEND_ORIGIN,
      ),
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
    ).finally(() => {
      setAcceptLoading(false);
      setIsVisible(false);
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
      visible={isVisible}
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
            <Text>New load#{load.loadNumber} has been assigned</Text>
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

export default AcceptLoadAlert;

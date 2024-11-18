import * as React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS, MODAL_VIEW_DELAY } from '../../constants';
import { useUserData } from '../../hooks/userData';
import { logout } from '../../utils/logout';

const AppMenuModal = ({
  visible,
  onRequestClose,
}: {
  visible: boolean;
  onRequestClose: VoidFunction;
}) => {
  const [, setUserData] = useUserData();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(visible);

  React.useEffect(() => {
    if (visible) {
      const timeoutId = setTimeout(
        () => setIsModalVisible(visible),
        MODAL_VIEW_DELAY,
      );
      return () => clearTimeout(timeoutId);
    } else {
      setIsModalVisible(visible);
    }
  }, [visible]);

  const handleLogout = () => {
    logout().then(() => {
      onRequestClose();
      setUserData(null);
    });
  };

  return (
    <Modal
      hardwareAccelerated={true}
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          {/*<View style={styles.dialogContents}>
            <Text>{alertData ? alertData.alertText : ''}</Text>
          </View>
          <View style={styles.spacer}></View>*/}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={{ color: COLORS.white }}>LOG OUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 100,
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
    width: '10%',
    zIndex: 1,
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    // flexDirection: 'column',
    // height: 30,
    padding: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '50%',
  },
  spacer: {
    height: 10,
  },
});

export default AppMenuModal;

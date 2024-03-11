import * as React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import * as Linking from 'expo-linking';
import { COLORS } from '../../constants';
import ModalButton from '../common/modalButton';

const ProminentDisclosureModal = ({
  visible,
  reject,
  grant,
}: {
  visible: boolean;
  reject: VoidFunction;
  grant: VoidFunction;
}) => {
  return (
    <Modal
      animated={true}
      hardwareAccelerated={true}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={reject}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <ScrollView
            style={styles.dialogContents}
            contentContainerStyle={styles.dialogContentsContainer}
          >
            <Text style={styles.dialogText}>
              This app collects location data to enable 4U Logistics to provide
              most suitable orders for you, even when the app is closed or not
              in use.
            </Text>
            <Text
              style={styles.link}
              onPress={() =>
                Linking.openURL('https://mobile.4u-logistics.com/pp.html')
              }
            >
              You can see the full text of our Privacy Policy here.
            </Text>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <ModalButton text={'Deny'} onPress={reject} />
            <ModalButton text={'Allow'} onPress={grant} />
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
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  dialogContents: {
    flexDirection: 'column',
    width: '100%',
  },
  dialogContentsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: '45%',
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
  dialogText: {
    fontSize: 20,
  },
  link: {
    color: COLORS.link,
    fontSize: 18,
    paddingTop: 20,
  },
});

export default ProminentDisclosureModal;

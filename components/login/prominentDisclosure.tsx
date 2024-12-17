import * as React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import * as Linking from 'expo-linking';
import { COLORS } from '../../constants';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import Spacer from '../common/Spacer';

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
      visible={visible}
      header={<Text>{'Prominent Disclosure'}</Text>}
      contents={
        <ScrollView
          style={styles.dialogContentsScroll}
          contentContainerStyle={styles.dialogContents}
        >
          <Spacer />
          <Text style={styles.dialogText}>
            This app collects location data to enable 4U Logistics to provide
            most suitable orders for you, even when the app is closed or not in
            use.
          </Text>
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL('https://mobile.4u-logistics.com/pp.html')
            }
          >
            You can see the full text of our Privacy Policy here.
          </Text>
          <Spacer />
        </ScrollView>
      }
      buttons={
        <>
          <ModalButton text={'Deny'} onPress={reject} />
          <ModalButton text={'Allow'} onPress={grant} />
        </>
      }
      close={reject}
    />
  );
};

const styles = StyleSheet.create({
  dialogContentsScroll: {
    flexDirection: 'column',
    height: 'auto',
    width: '100%',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
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

import * as React from 'react';
import {
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../../constants';

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
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.modalBackground,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            height: '45%',
            width: '90%',
            borderRadius: 10,
            padding: 35,
            alignItems: 'center',
            shadowColor: COLORS.black,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            flexDirection: 'column',
          }}
        >
          <ScrollView
            style={{
              flexDirection: 'column',
              width: '100%',
            }}
            contentContainerStyle={{
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 20,
              }}
            >
              This app collects location data to enable 4U Logistics to provide
              most suitable orders for you, even when the app is closed or not
              in use.
            </Text>
            <Text
              style={{
                paddingTop: 20,
                fontSize: 18,
                color: COLORS.link,
              }}
              onPress={() =>
                Linking.openURL('https://mobile.4u-logistics.com/pp.html')
              }
            >
              You can see the full text of our Privacy Policy here.
            </Text>
          </ScrollView>
          <View
            style={{
              height: 40,
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                width: '45%',
                height: 40,
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 40,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={reject}
              >
                <Text style={{ color: COLORS.white }}>Deny</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '45%',
                height: 40,
                marginTop: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 40,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={grant}
              >
                <Text style={{ color: COLORS.white }}>Allow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProminentDisclosureModal;

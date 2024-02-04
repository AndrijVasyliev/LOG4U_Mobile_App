import * as React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants';

const ForceLoginModal = ({
  visible,
  cancel,
  proceed,
}: {
  visible: boolean;
  cancel: () => void;
  proceed: () => void;
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
              Seems like you where logged in on other device. If you still want
              to continue from this device, then press Continue button. Or press
              Cancel.
            </Text>
            <Text
              style={{
                paddingTop: 20,
                fontSize: 18,
              }}
            >
              Note: You can use only one device to track location at a time.
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
                onPress={cancel}
              >
                <Text style={{ color: COLORS.white }}>Cancel</Text>
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
                onPress={proceed}
              >
                <Text style={{ color: COLORS.white }}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForceLoginModal;

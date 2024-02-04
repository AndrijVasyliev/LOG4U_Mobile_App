import * as React from 'react';
import { Linking, ScrollView, Text } from 'react-native';
import { COLORS } from '../../constants';

const WelcomeText = () => {
  return (
    <ScrollView
      style={{
        flexDirection: 'column',
        width: '100%',
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
      }}
      contentContainerStyle={{
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 18,
        }}
      >
        Welcome to the 4U Track app.
      </Text>
      <Text
        style={{
          fontSize: 16,
        }}
      >
        We look forward to a productive collaboration and strive to make your
        interaction convenient. To log in, please use the username and password
        provided to you via email by the 4ULogistics support team. If you wish
        to register as a driver or have forgotten your credentials, please
        contact the 4ULogistics support team, and we will be happy to assist
        you.
      </Text>
      <Text
        style={{
          paddingTop: 20,
          fontSize: 18,
          color: COLORS.link,
        }}
        onPress={() => Linking.openURL('mailto:4ulogisticsllc@gmail.com')}
      >
        Contact our support team.
      </Text>
    </ScrollView>
  );
};

export default WelcomeText;

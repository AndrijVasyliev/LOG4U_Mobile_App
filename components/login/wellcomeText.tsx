import * as React from 'react';
import { Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../constants';

const WelcomeText = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
    >
      <Text style={styles.head}>Welcome to the 4U Track app.</Text>
      <Text style={styles.text}>
        We look forward to a productive collaboration and strive to make your
        interaction convenient. To log in, please use the username and password
        provided to you via email by the 4ULogistics support team. If you wish
        to register as a driver or have forgotten your credentials, please
        contact the 4ULogistics support team, and we will be happy to assist
        you.
      </Text>
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('mailto:4ulogisticsllc@gmail.com')}
      >
        Contact our support team.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    width: '100%',
  },
  containerContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  head: {
    fontSize: 18,
  },
  link: {
    color: COLORS.link,
    fontSize: 18,
    paddingTop: 20,
  },
  text: {
    fontSize: 16,
  },
});

export default WelcomeText;

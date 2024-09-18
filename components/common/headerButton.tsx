import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, icons } from '../../constants';
import AppMenuModal from '../home/appMenu';
import { useUserData } from '../../hooks/userData';

const HeaderButton = () => {
  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

  const [userData] = useUserData();

  const handleOpenMenu = () => {
    setMenuVisible(true);
  };
  const handleRequestClose = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <AppMenuModal visible={menuVisible} onRequestClose={handleRequestClose} />
      <TouchableOpacity style={styles.container} onPress={handleOpenMenu}>
        <Image
          source={icons.AccountCircle}
          resizeMode="contain"
          style={styles.logo}
        />
      </TouchableOpacity>
      <Text style={styles.username}>{userData?.fullName || ''}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  logo: { height: 20, resizeMode: 'contain', width: 20 },
  username: { color: COLORS.white },
});

export default HeaderButton;

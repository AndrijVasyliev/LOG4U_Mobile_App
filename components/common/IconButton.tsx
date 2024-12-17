import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';

const IconButton = ({
  iconName,
  onClick,
}: {
  iconName: string;
  onClick: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.addButton} onPress={onClick}>
      <MaterialCommunityIcons name={iconName} color={COLORS.black} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default IconButton;

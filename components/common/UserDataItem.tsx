import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';

const UserDataItem = ({
  iconName,
  value,
  fieldName,
}: {
  iconName?: string;
  value: string;
  fieldName: string;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name={iconName}
          color={COLORS.black}
          size={24}
        />
        <Text style={styles.valueText}>{`${value}`}</Text>
      </View>
      <Text>{fieldName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  valueText: {
    paddingLeft: 5,
  },
});

export default UserDataItem;

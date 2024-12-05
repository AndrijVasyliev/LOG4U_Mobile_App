import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';

const UserDataItem = ({
  iconName,
  isDense = false,
  value,
  fieldName,
}: {
  iconName?: string;
  isDense?: boolean;
  value: string;
  fieldName: string;
}) => {
  return (
    <View
      style={[styles.container, isDense ? styles.containerDense : undefined]}
    >
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name={iconName}
          color={COLORS.black}
          size={24}
        />
        <Text style={styles.valueText} numberOfLines={2}>{`${value}`}</Text>
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
  containerDense: {
    height: 25,
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    maxWidth: '70%',
  },
  valueText: {
    paddingLeft: 5,
    maxWidth: '100%',
  },
});

export default UserDataItem;

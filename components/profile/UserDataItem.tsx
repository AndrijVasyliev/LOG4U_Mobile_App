import * as React from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';

const UserDataItem = ({
  iconName,
  value,
  fieldName,
}: {
  iconName: string;
  value: string;
  fieldName: string;
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        height: 40,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons
          name={iconName}
          color={COLORS.black}
          size={24}
        />
        <Text
          style={{
            paddingLeft: 5,
          }}
        >{`${value}`}</Text>
      </View>
      <Text>{fieldName}</Text>
    </View>
  );
};

export default UserDataItem;

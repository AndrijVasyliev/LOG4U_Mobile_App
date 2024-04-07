import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';

const FileList = ({
  objectId,
  objectType,
  caption,
}: {
  objectId?: string;
  objectType?: 'Truck' | 'Person';
  caption: string;
}) => {
  const [expended, setExpanded] = React.useState<boolean>(false);
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name="folder-table-outline"
          color={COLORS.black}
          size={24}
        />
        <TouchableOpacity
          style={styles.folderButton}
          onPress={() => {
            setExpanded((prev) => !prev);
          }}
        >
          <Text style={styles.valueText}>{`${caption}`}</Text>
          <MaterialCommunityIcons
            name={expended ? 'menu-up' : 'menu-down'}
            color={COLORS.black}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => {}}>
        <MaterialCommunityIcons
          name="file-image-plus-outline"
          color={COLORS.black}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  folderButton: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  valueText: {
    paddingLeft: 5,
    paddingRight: 15,
  },
});

export default FileList;

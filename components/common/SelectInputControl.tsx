import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { COLORS } from '../../constants';

const SelectInputControl = ({
  placeholder,
  items = [],
  value,
  onChange,
}: {
  placeholder: string;
  items: { label: string; value: string }[];
  value: string;
  onChange: (newValue: string) => void;
}) => {
  const [selectOpen, setSelectOpen] = React.useState<boolean>(false);
  const [selectValue, setSelectValue] = React.useState<string>('');
  const [locationSearchValue, setSelectSearchValue] =
    React.useState<string>('');
  const [selectItems, setSelectItems] = React.useState<ItemType<string>[]>([]);

  React.useEffect(() => {
    setSelectItems(items);
  }, items);

  React.useEffect(() => {
    if (!selectOpen && selectValue) {
      onChange(selectValue);
    }
  }, [selectOpen]);

  React.useEffect(() => {
    setSelectValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <DropDownPicker<string>
        /*zIndex={10}
        zIndexInverse={10}*/
        disableBorderRadius={false}
        modalAnimationType="slide"
        // dropDownDirection="TOP"
        dropDownDirection="BOTTOM"
        placeholder={placeholder}
        translation={{
          SEARCH_PLACEHOLDER: 'Start to enter',
          NOTHING_TO_SHOW: 'No selected item',
        }}
        searchPlaceholderTextColor={COLORS.gray2}
        disableLocalSearch={true}
        onChangeSearchText={setSelectSearchValue}
        style={styles.dropdown}
        textStyle={styles.text}
        containerStyle={styles.dropdownControlContainer}
        disabledStyle={styles.dropdownDisabled}
        placeholderStyle={styles.dropdownPlaceholder}
        dropDownContainerStyle={styles.dropdownContainer}
        searchContainerStyle={styles.dropdownSearchContainer}
        searchTextInputStyle={styles.dropdownSearch}
        listMode="SCROLLVIEW"
        labelProps={{
          numberOfLines: 2,
        }}
        scrollViewProps={{
          persistentScrollbar: true,
          showsVerticalScrollIndicator: true,
        }}
        ArrowUpIconComponent={() => (
          <MaterialCommunityIcons
            name="menu-up"
            color={COLORS.black}
            size={24}
          />
        )}
        ArrowDownIconComponent={() => (
          <MaterialCommunityIcons
            name="menu-down"
            color={COLORS.black}
            size={24}
          />
        )}
        TickIconComponent={() => (
          <MaterialCommunityIcons name="check" color={COLORS.black} size={24} />
        )}
        disabled={false}
        searchable={false}
        open={selectOpen}
        loading={false}
        value={selectValue}
        items={selectItems}
        setOpen={setSelectOpen}
        setValue={setSelectValue}
        setItems={setSelectItems}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-start',
    marginTop: 5,
    width: '100%',
  },
  dropdown: {
    backgroundColor: COLORS.unset,
    borderWidth: 0,
  },
  dropdownContainer: {
    maxHeight: 95,
    backgroundColor: COLORS.lightWhite,
    borderColor: COLORS.gray,
  },
  dropdownControlContainer: {
    width: '100%',
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownPlaceholder: {
    color: COLORS.gray2,
  },
  dropdownSearch: {
    borderColor: COLORS.gray,
  },
  dropdownSearchContainer: {
    borderBottomColor: COLORS.gray3,
  },
  text: {},
});

export default SelectInputControl;

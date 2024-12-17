import * as React from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { BACKEND_ORIGIN, COLORS, LOAD_PATH } from '../../constants';
import Modal from '../common/Modal';
import ModalButton from '../common/modalButton';
import TextInputControl from '../common/TextInputControl';
import SelectInputControl from '../common/SelectInputControl';
import IconButton from '../common/IconButton';
import Spacer from '../common/Spacer';
import FileList from '../file/fileList';
import { useFetch } from '../../hooks/useFetch';

const initialValues = {
  pieces: 1,
  unitOfWeight: 'LBS',
  weight: '',
  bol: null,
  seal: '',
  addressIsCorrect: null,
};

const PickUpDriversInfo = ({
  loadId,
  index,
  stops,
  setSelectedDriversInfo,
  onChanged = () => {},
}: {
  loadId: string;
  index: number;
  stops: Record<string, any>[];
  setSelectedDriversInfo?: (number) => void;
  onChanged?: (number) => void;
}) => {
  const [pickUpDriversItems, setPickUpDriversItems] = React.useState<
    Record<string, string | number>[] | void
  >(undefined);
  const [canSave, setCanSave] = React.useState<boolean>(false);
  const [bolItems, setBolItems] = React.useState<
    { label: string; value: string }[] | void
  >(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const authFetch = useFetch();

  const screenHeight = Dimensions.get('window').height;
  let calculatedHeight = (screenHeight * 90) / 100 - 40 - 10 - 2 - 60;
  calculatedHeight = calculatedHeight > 0 ? calculatedHeight : 0;

  React.useEffect(() => {
    if (!pickUpDriversItems) {
      setCanSave(false);
      console.log('Set False');
      return;
    }
    let hasEmptyValues = false;
    pickUpDriversItems.forEach((item) => {
      const isAllFieldsFilled = Object.keys(initialValues).reduce(
        (acc, key) =>
          acc &&
          item[key] !== '' &&
          item[key] !== null &&
          item[key] !== undefined,
        true,
      );
      if (!isAllFieldsFilled) {
        hasEmptyValues = true;
      }
    });
    setCanSave(!hasEmptyValues && !!stops[index].stopId);
    console.log('Set', hasEmptyValues, stops[index].stopId);
  }, [pickUpDriversItems]);

  React.useEffect(() => {
    if (stops[index].driversInfo?.length > 0) {
      setPickUpDriversItems(stops[index].driversInfo);
    } else {
      setPickUpDriversItems([{ ...initialValues }]);
    }
  }, [stops[index]]);

  React.useEffect(() => {
    const freightItems = stops[index].freightList
      .filter((freight) => freight.freightId)
      .map((freight, freightIndex: number) => ({
        value: freight.freightId as string,
        label: `Freight #${freightIndex + 1} (Stop PickUp#${index + 1}): ${freight.pieces} pcs, ${freight.length} ${freight.unitOfLength} length, ${freight.weight} ${freight.unitOfWeight} weight`,
      }));
    setBolItems(freightItems);
  }, [stops[index]]);

  const getOnChangeHandler = (index: number, fieldName: string) => {
    return (newValue) => {
      setPickUpDriversItems(
        (prevDriversInfo): Record<string, string | number>[] => {
          if (prevDriversInfo) {
            const newDriverInfo = [...prevDriversInfo];
            newDriverInfo[index][fieldName] = newValue;
            return newDriverInfo;
          }
        },
      );
    };
  };
  const getRemoveItemHandler = (index: number) => {
    return () => {
      setPickUpDriversItems(
        (prevDriversInfo): Record<string, string | number>[] => {
          if (prevDriversInfo) {
            const newDriverInfo = [...prevDriversInfo];
            newDriverInfo.splice(index, 1);
            return newDriverInfo;
          }
        },
      );
    };
  };
  const getAddItemHandler = () => {
    return () => {
      setPickUpDriversItems(
        (prevDriversInfo): Record<string, string | number>[] => {
          if (prevDriversInfo) {
            const newDriverInfo = [...prevDriversInfo];
            newDriverInfo.push({ ...initialValues });
            return newDriverInfo;
          }
        },
      );
    };
  };

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    setIsLoading(true);
    authFetch(
      new URL(
        `${LOAD_PATH}/${loadId}/stopPickUp/${stops[index].stopId}/driversInfo`,
        BACKEND_ORIGIN,
      ),
      {
        method: 'PATCH',
        body: JSON.stringify(pickUpDriversItems),
      },
    ).finally(() => {
      setIsLoading(false);
      onChanged(Date.now());
    });
  };
  const handleClose = () => {
    setSelectedDriversInfo(undefined);
  };

  return (
    <>
      <Modal
        visible={!!pickUpDriversItems}
        header={
          <>
            <Text>{'Add Load Info'}</Text>
            <IconButton
              iconName="note-plus-outline"
              onClick={getAddItemHandler()}
            />
          </>
        }
        contents={
          <ScrollView
            style={[
              styles.dialogContentsScroll,
              { maxHeight: calculatedHeight },
            ]}
            contentContainerStyle={styles.dialogContents}
          >
            {!pickUpDriversItems
              ? null
              : pickUpDriversItems.map((item, index) => (
                  <View key={index} style={styles.driversInfoItemWrapper}>
                    <View style={styles.driversInfoItemHeader}>
                      <Text>{`Doc# ${index + 1}`}</Text>
                      <IconButton
                        iconName="note-minus-outline"
                        onClick={getRemoveItemHandler(index)}
                      />
                    </View>
                    <View style={styles.driversInfoItem}>
                      <TextInputControl
                        placeholder="Enter number of pieces"
                        value={`${item.pieces}`}
                        number
                        onChange={getOnChangeHandler(index, 'pieces')}
                      />
                      <SelectInputControl
                        placeholder="Select Unit Of Weight"
                        items={[
                          { label: 'LBS', value: 'LBS' },
                          { label: 'KG', value: 'KG' },
                          { label: 'TON', value: 'TON' },
                        ]}
                        value={`${item.unitOfWeight}`}
                        onChange={getOnChangeHandler(index, 'unitOfWeight')}
                      />
                      <TextInputControl
                        placeholder="Enter load`s weight"
                        value={`${item.weight}`}
                        number
                        onChange={getOnChangeHandler(index, 'weight')}
                      />
                      <SelectInputControl
                        placeholder="Select BOL"
                        items={bolItems || []}
                        value={`${item.bol}`}
                        onChange={getOnChangeHandler(index, 'bol')}
                      />
                      <TextInputControl
                        placeholder="Enter load`s seal#"
                        value={`${item.seal}`}
                        onChange={getOnChangeHandler(index, 'seal')}
                      />
                      <SelectInputControl
                        placeholder="Select is address correct"
                        items={[
                          { label: 'Address is correct', value: 'true' },
                          { label: 'Address is NOT correct', value: 'false' },
                        ]}
                        value={`${item.addressIsCorrect}`}
                        onChange={getOnChangeHandler(index, 'addressIsCorrect')}
                      />
                      {!item.driversInfoId ? (
                        <Spacer />
                      ) : (
                        <FileList
                          objectId={loadId}
                          objectType="Load"
                          label="Load`s docs"
                          tags={{
                            [`${item.driversInfoId}`]: 'StopPickUpDriversInfo',
                          }}
                        />
                      )}
                    </View>
                  </View>
                ))}
          </ScrollView>
        }
        buttons={
          <>
            <ModalButton
              text={'Close'}
              disabled={false}
              onPress={handleClose}
            />
            <ModalButton
              text={'Save'}
              disabled={!canSave}
              onPress={handleSave}
            />
          </>
        }
        close={handleClose}
      />
      <Spinner visible={isLoading} textContent={'Saving data...'} />
    </>
  );
};

const styles = StyleSheet.create({
  driversInfoItemWrapper: {
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 'auto',
    marginTop: 2,
    marginBottom: 2,
    width: '100%',
  },
  driversInfoItemHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
  },
  driversInfoItem: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 'auto',
    marginTop: 5,
    width: '100%',
  },
  dialogContentsScroll: {
    flexDirection: 'column',
    height: 'auto',
    width: '100%',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  },
});

export default PickUpDriversInfo;

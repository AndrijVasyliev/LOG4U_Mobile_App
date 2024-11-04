import * as React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { BACKEND_ORIGIN, COLORS, LOAD_PATH } from '../../constants';
import ModalButton from '../common/modalButton';
import TextInputControl from '../common/TextInputControl';
import SelectInputControl from '../common/SelectInputControl';
import FileList from '../profile/fileList';
import IconButton from '../common/IconButton';
import { authFetch } from '../../utils/authFetch';

const initialValues = { bol: '', signedBy: '' };

const DeliveryDriversInfo = ({
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
  const [deliveryDriversItems, setDeliveryDriversItems] = React.useState<
    Record<string, string | number>[] | void
  >(undefined);
  const [canSave, setCanSave] = React.useState<boolean>(false);
  const [bolItems, setBolItems] = React.useState<
    { label: string; value: string }[] | void
  >(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!deliveryDriversItems) {
      setCanSave(false);
      return;
    }
    let hasEmptyValues = false;
    deliveryDriversItems.forEach((item) => {
      const isAllFieldsFilled = Object.keys(initialValues).reduce(
        (acc, key) => acc && !!item[key],
        true,
      );
      if (!isAllFieldsFilled) {
        hasEmptyValues = true;
      }
    });
    setCanSave(!hasEmptyValues && !!stops[index].stopId);
  }, [deliveryDriversItems]);

  React.useEffect(() => {
    if (stops[index].driversInfo?.length > 0) {
      setDeliveryDriversItems(stops[index].driversInfo);
    } else {
      setDeliveryDriversItems([{ ...initialValues }]);
    }
  }, [stops[index]]);

  React.useEffect(() => {
    const freightItems = stops
      ?.filter((stop) => stop.type === 'PickUp')
      .flatMap((stop, stopIndex: number) =>
        stop.freightList
          .filter((freight) => freight.freightId)
          .map((freight, freightIndex: number) => ({
            value: freight.freightId as string,
            label: `Freight #${freightIndex + 1} (Stop PickUp#${stopIndex + 1}): ${freight.pieces} pcs, ${freight.length} ${freight.unitOfLength} length, ${freight.weight} ${freight.unitOfWeight} weight`,
          })),
      );
    setBolItems(freightItems);
  }, [stops]);

  const getOnChangeHandler = (index: number, fieldName: string) => {
    return (newValue) => {
      setDeliveryDriversItems(
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
      setDeliveryDriversItems(
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
      setDeliveryDriversItems(
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
        `${LOAD_PATH}/${loadId}/stopDelivery/${stops[index].stopId}/driversInfo`,
        BACKEND_ORIGIN,
      ),
      {
        method: 'PATCH',
        body: JSON.stringify(deliveryDriversItems),
      },
    ).finally(() => {
      setIsLoading(false);
      setTimeout(() => onChanged(Date.now()), 1);
    });
  };
  const handleClose = () => {
    setSelectedDriversInfo(undefined);
  };

  return (
    <Modal
      animated={false}
      hardwareAccelerated={true}
      animationType="none"
      presentationStyle="overFullScreen"
      transparent={true}
      visible={!!deliveryDriversItems}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.area} />
        </TouchableWithoutFeedback>
        <View style={styles.dialogPaper}>
          <View style={styles.driversInfoHeader}>
            <Text>{'Add Info About PoD'}</Text>
            <IconButton
              iconName="note-plus-outline"
              onClick={getAddItemHandler()}
            />
          </View>
          <ScrollView
            style={styles.dialogContentsScroll}
            contentContainerStyle={styles.dialogContents}
          >
            {!deliveryDriversItems
              ? null
              : deliveryDriversItems.map((item, index) => (
                  <View key={index} style={styles.driversInfoItemWrapper}>
                    <View style={styles.driversInfoItemHeader}>
                      <Text>{`PoD# ${index + 1}`}</Text>
                      <IconButton
                        iconName="note-minus-outline"
                        onClick={getRemoveItemHandler(index)}
                      />
                    </View>
                    <View style={styles.driversInfoItem}>
                      <TextInputControl
                        placeholder="Enter Signed By"
                        value={`${item.signedBy}`}
                        onChange={getOnChangeHandler(index, 'signedBy')}
                      />
                      <SelectInputControl
                        placeholder="Select BOL"
                        items={bolItems || []}
                        value={`${item.bol}`}
                        onChange={getOnChangeHandler(index, 'bol')}
                      />
                      {!item.driversInfoId ? null : (
                        <FileList
                          objectId={loadId}
                          objectType="Load"
                          label="Load`s docs"
                          tags={{
                            [`${item.driversInfoId}`]:
                              'StopDeliveryDriversInfo',
                          }}
                        />
                      )}
                    </View>
                    <IconButton
                      iconName="note-minus-outline"
                      onClick={getRemoveItemHandler(index)}
                    />
                  </View>
                ))}
          </ScrollView>
          <View style={styles.spacer}></View>
          <IconButton
            iconName="note-plus-outline"
            onClick={getAddItemHandler()}
          />
          <View style={styles.spacer}></View>
          <View style={styles.buttonContainer}>
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
          </View>
        </View>
      </View>
      <Spinner visible={isLoading} textContent={'Saving data...'} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  area: {
    backgroundColor: COLORS.modalBackground,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    paddingLeft: '1%',
    paddingRight: '1%',
    width: '100%',
  },
  driversInfoItemWrapper: {
    borderColor: COLORS.gray,
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 'auto',
    marginTop: 5,
    width: '100%',
  },
  driversInfoHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
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
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.modalBackground,
    flex: 1,
    justifyContent: 'center',
  },
  dialogContentsScroll: {
    borderTopColor: COLORS.gray,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  dialogContents: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    zIndex: 1,
  },
  dialogPaper: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'column',
    height: '90%',
    paddingBottom: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '90%',
  },
  spacer: {
    height: 10,
  },
});

export default DeliveryDriversInfo;

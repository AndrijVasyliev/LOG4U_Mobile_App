import * as React from 'react';
import { StyleSheet } from 'react-native';
import UserDataItem from '../common/UserDataItem';

const Freight = ({
  freightNumber,
  freight,
}: {
  freightNumber: number;
  freight: Record<string, any>;
}) => {
  return (
    <>
      <UserDataItem
        iconName="package"
        value={`${freight?.pieces ? freight.pieces + ' pcs, ' : ''}${freight?.length ? freight.length + (freight?.unitOfLength ? ' ' + freight.unitOfLength + ', ' : '') : ''}${freight?.weight ? freight.weight + (freight?.unitOfWeight ? ' ' + freight.unitOfWeight : '') : ''}`}
        isDense
        fieldName={`Freight #${freightNumber}`}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default Freight;

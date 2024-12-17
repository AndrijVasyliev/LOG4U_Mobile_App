import * as React from 'react';
import StopPickUp from './stopPickUp';
import StopDelivery from './stopDelivery';
import PickUpDriversInfo from './pickUpDriversInfo';
import DeliveryDriversInfo from './deliveryDriversInfo';

const Stops = ({
  loadId,
  stops,
  onChanged = () => {},
}: {
  loadId: string;
  stops: Record<string, any>[];
  onChanged?: (number) => void;
}) => {
  const [driversInfoIndex, setDriversInfoIndex] = React.useState<number | void>(
    undefined,
  );
  return (
    <>
      {!(
        (driversInfoIndex || driversInfoIndex === 0) &&
        stops[driversInfoIndex].type === 'PickUp'
      ) ? null : (
        <PickUpDriversInfo
          loadId={loadId}
          index={driversInfoIndex}
          stops={stops}
          setSelectedDriversInfo={setDriversInfoIndex}
          onChanged={onChanged}
        />
      )}
      {!(
        (driversInfoIndex || driversInfoIndex === 0) &&
        stops[driversInfoIndex].type === 'Delivery'
      ) ? null : (
        <DeliveryDriversInfo
          loadId={loadId}
          index={driversInfoIndex}
          stops={stops}
          setSelectedDriversInfo={setDriversInfoIndex}
          onChanged={onChanged}
        />
      )}
      {stops.map((stop, index) => {
        switch (stop.type) {
          case 'PickUp':
            return (
              <StopPickUp
                loadId={loadId}
                key={stop.stopId}
                index={index}
                stops={stops}
                setSelectedDriversInfo={setDriversInfoIndex}
                onChanged={onChanged}
              />
            );
          case 'Delivery':
            return (
              <StopDelivery
                loadId={loadId}
                key={stop.stopId}
                index={index}
                stops={stops}
                setSelectedDriversInfo={setDriversInfoIndex}
                onChanged={onChanged}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default Stops;

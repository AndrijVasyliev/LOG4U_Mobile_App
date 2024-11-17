import * as React from 'react';
import StopPickUp from './stopPickUp';
import StopDelivery from './stopDelivery';

const Stops = ({
  loadId,
  stops,
  onChanged = () => {},
}: {
  loadId: string;
  stops: Record<string, any>[];
  onChanged?: (number) => void;
}) => {
  return (
    <>
      {stops.map((stop, index) => {
        switch (stop.type) {
          case 'PickUp':
            return <StopPickUp key={stop.stopId} index={index} stops={stops} />;
          case 'Delivery':
            return (
              <StopDelivery key={stop.stopId} index={index} stops={stops} />
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default Stops;

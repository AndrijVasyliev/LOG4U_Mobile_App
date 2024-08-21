import * as React from 'react';
import StopPickUp from './stopPickUp';
import StopDelivery from './stopDelivery';

const Stops = ({ stops }: { stops: Record<string, any>[] }) => {
  return (
    <>
      {stops.map((stop, index) => {
        switch (stop.type) {
          case 'PickUp':
            return (
              <StopPickUp
                key={stop.stopId}
                stopNumber={index + 1}
                pickUpNumber={
                  stops
                    .slice(0, index + 1)
                    .filter((stop) => stop.type === 'PickUp').length
                }
                stop={stop}
              />
            );
          case 'Delivery':
            return (
              <StopDelivery
                key={stop.stopId}
                stopNumber={index + 1}
                deliveryNumber={
                  stops
                    .slice(0, index + 1)
                    .filter((stop) => stop.type === 'Delivery').length
                }
                stop={stop}
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

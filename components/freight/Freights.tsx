import * as React from 'react';
import Freight from './Freight';

const Freights = ({ freights }: { freights: Record<string, any>[] }) => {
  return (
    <>
      {freights.map((freight, index) => {
        return (
          <Freight key={index} freightNumber={index + 1} freight={freight} />
        );
      })}
    </>
  );
};

export default Freights;

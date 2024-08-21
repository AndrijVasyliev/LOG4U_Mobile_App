import { dateTimeFormatter } from './dateTimeFormatters';
import { fromISOCorrected } from './dateTimeConverters';

enum TimeFrameType {
  FCFS = 'FCFS',
  APPT = 'APPT',
  ASAP = 'ASAP',
  Direct = 'Direct',
}

type TimeFrameFCFS = {
  type: TimeFrameType.FCFS;
  from: string;
  to: string;
};

type TimeFrameAPPT = {
  type: TimeFrameType.APPT;
  at: string;
};

type TimeFrameASAP = {
  type: TimeFrameType.ASAP;
  at: string;
};

type TimeFrameDirect = {
  type: TimeFrameType.Direct;
  at: string;
};

export const fromTimeFrame = (
  timeframe: TimeFrameFCFS | TimeFrameAPPT | TimeFrameASAP | TimeFrameDirect,
): string => {
  switch (timeframe.type) {
    case TimeFrameType.FCFS:
      return `FCFS ${dateTimeFormatter.format(fromISOCorrected(timeframe.from))}\n     ${dateTimeFormatter.format(fromISOCorrected(timeframe.to))}`;
    case TimeFrameType.APPT:
      return `APPT ${dateTimeFormatter.format(fromISOCorrected(timeframe.at))}`;
    case TimeFrameType.ASAP:
      return `ASAP ${dateTimeFormatter.format(fromISOCorrected(timeframe.at))}`;
    case TimeFrameType.Direct:
      return `DIRECT ${dateTimeFormatter.format(fromISOCorrected(timeframe.at))}`;
    default:
      return '';
  }
};

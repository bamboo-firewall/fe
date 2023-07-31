/* eslint-disable no-unused-vars */
import dayjs, { Dayjs } from 'dayjs';

type IUnitOptions = {
  millisecond?: boolean;
  second?: boolean;
  minute?: boolean;
  hour?: boolean;
  dateOfMonth?: boolean;
  dayOfWeek?: boolean;
  month?: boolean;
  year?: boolean;
};

type IUnitData = {
  millisecond?: number;
  second?: number;
  minute?: number;
  hour?: number;
  dateOfMonth?: number;
  dayOfWeek?: number;
  month?: number;
  year?: number;
};

interface ITimeUtils {
  _time: Dayjs;
  getTime(): Dayjs;
  format(template?: string): string;
  getTimeUnit(unit: IUnitOptions): IUnitData;
  set(unit: dayjs.UnitType, value: number): this;
  addTime(num: number, unit: dayjs.ManipulateType): this;
  subtractTime(num: number, unit: dayjs.ManipulateType): this;
  startOfTime(unit: dayjs.OpUnitType): this;
  endOfTime(unit: dayjs.OpUnitType): this;
  getDifferenceTime(compareTime: dayjs.ConfigType, unit?: dayjs.QUnitType | dayjs.OpUnitType): number;
  isSameDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType): boolean;
  isAfterDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType): boolean;
  isBeforeDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType): boolean;
  isSameOrAfterDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType): boolean;
  isSameOrBeforeDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType): boolean;
}

const defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

export default function dayts(input?: dayjs.ConfigType, format?: dayjs.OptionType): ITimeUtils {
  const _instance: ITimeUtils = {
    _time: dayjs(input, format),
    getTime() {
      return this._time;
    },
    format(template: string = defaultFormat): string {
      if (!this._time) return dayjs().format(template);
      return this._time.format(template);
    },
    set(unit: dayjs.UnitType, value: number) {
      this._time.set(unit, value);
      return this;
    },
    getTimeUnit(unit: IUnitOptions) {
      const date = this._time;
      const objectDate: IUnitData = {};
      if (unit?.millisecond) objectDate.millisecond = date.millisecond();
      if (unit?.second) objectDate.second = date.second();
      if (unit?.hour) objectDate.hour = date.hour();
      if (unit?.minute) objectDate.minute = date.minute();
      if (unit?.dateOfMonth) objectDate.dateOfMonth = date.date();
      if (unit?.dayOfWeek) objectDate.dayOfWeek = date.day();
      if (unit?.month) objectDate.month = date.month() + 1;
      if (unit?.year) objectDate.year = date.year();

      return objectDate;
    },

    addTime(num: number = 0, unit: dayjs.ManipulateType = 'day'): ITimeUtils {
      this._time = this._time.add(num, unit);
      return this;
    },

    subtractTime(num: number = 0, unit: dayjs.ManipulateType = 'day'): ITimeUtils {
      this._time = this._time.subtract(num, unit);
      return this;
    },

    startOfTime(unit: dayjs.OpUnitType = 'day'): ITimeUtils {
      this._time = this._time.startOf(unit);
      return this;
    },

    endOfTime(unit: dayjs.OpUnitType = 'day'): ITimeUtils {
      this._time = this._time.endOf(unit);
      return this;
    },

    getDifferenceTime(
      compareTime: dayjs.ConfigType,
      unit: dayjs.QUnitType | dayjs.OpUnitType = 'days'
    ): number {
      return this._time.diff(compareTime, unit);
    },

    isSameDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType = 'days') {
      return this._time.isSame(compareTime, unit);
    },

    isAfterDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType = 'days') {
      return this._time.isAfter(compareTime, unit);
    },

    isBeforeDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType = 'days'): boolean {
      return this._time.isBefore(compareTime, unit);
    },

    isSameOrAfterDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType = 'days'): boolean {
      return this.isSameDate(compareTime, unit) || this.isAfterDate(compareTime, unit);
    },

    isSameOrBeforeDate(compareTime: dayjs.ConfigType, unit: dayjs.OpUnitType = 'days'): boolean {
      return this.isSameDate(compareTime, unit) || this.isBeforeDate(compareTime, unit);
    },
  };
  return _instance;
}

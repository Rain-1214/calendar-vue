import LunarCalendarDataService from './LunarCalendar';
import { ILunarData } from '@/index.type';
import { expect } from 'chai';

describe('Service: LunarCalendarData', () => {

  let service: LunarCalendarDataService;

  beforeEach(() => {
    service = LunarCalendarDataService.getInstance();
  });

  it('should get lunar data from "getLunarMonthAndDay"', () => {
    const [year, month, day] = [2018, 6, 5];
    const lunarData: ILunarData = {
      month: 4,
      monthStr: '四月',
      day: 22,
      dayStr: '廿二',
      currentMonthDaysNum: 30,
      isLeapMonth: false,
      isLeapYear: false,
      chineseEra: {
        heavenlyStems: 4,
        earthlyBranches: 10,
        era: '戊戌',
        chineseZodiacAnimal: '狗',
      },
    };

    expect(service.getLunarMonthAndDay(year, month, day)).to.equal(lunarData);
    const [ year1, month1, day1 ] = [ 1900, 1, 1 ];
    const lunarData1: ILunarData = {
      month: 12,
      monthStr: '腊月',
      day: 1,
      dayStr: '初一',
      currentMonthDaysNum: 30,
      isLeapMonth: false,
      isLeapYear: false,
      chineseEra: {
        heavenlyStems: 5,
        earthlyBranches: 11,
        era: '己亥',
        chineseZodiacAnimal: '猪',
      },
    };
    expect(service.getLunarMonthAndDay(year1, month1, day1)).to.equal(lunarData1);
    const [ year2, month2, day2 ] = [ 2050, 12, 31 ];
    const lunarData2: ILunarData = {
      month: 11,
      monthStr: '十一月',
      day: 18,
      dayStr: '十八',
      currentMonthDaysNum: 30,
      isLeapMonth: false,
      isLeapYear: true,
      chineseEra: {
        heavenlyStems: 6,
        earthlyBranches: 6,
        era: '庚午',
        chineseZodiacAnimal: '马',
      },
    };
    expect(service.getLunarMonthAndDay(year2, month2, day2)).to.equal(lunarData2);
  });

  it('should throw error when param is out of safety scope', () => {
    expect(() => service.getLunarMonthAndDay(1899, 11, 31)).throw();
    expect(() => service.getLunarMonthAndDay(1899, 12, 1)).not.throw();
    expect(() => service.getLunarMonthAndDay(2051, 2, 1)).throw();
    expect(() => service.getLunarMonthAndDay(2051, 1, 31)).not.throw();
  });

  it('should return boolean from method "getIsLeapYear"', () => {
    expect(service.getIsLeapYear(1900)).to.equal(true);
    expect(service.getIsLeapYear(1901)).to.equal(false);
    expect(() => service.getIsLeapYear(1890)).throw();
    expect(() => service.getIsLeapYear(2052)).throw();
  });

  it('should return day number from "getLunarYearDayNum"', () => {
    expect(service.getLunarYearDayNum(1900)).to.equal(384);
    expect(() => service.getLunarYearDayNum(1898)).throw();
    expect(() => service.getLunarYearDayNum(2052)).throw();
  });

  it('shuold return leap month number from "getLeapMonthNum"', () => {
    expect(service.getLeapMonthNum(1900)).to.equal(8);
    expect(service.getLeapMonthNum(2017)).to.equal(6);
    expect(service.getLeapMonthNum(2015)).to.equal(-1);
    expect(() => service.getLeapMonthNum(1898)).throw();
    expect(() => service.getLeapMonthNum(2052)).throw();
  });

  // tslint:disable-next-line:max-line-length
  it('shuold return day num of lunar month from "getLunarMonthDays"', () => {
    expect(service.getLunarMonthDays(2018, 4)).to.equal(30);
    expect(service.getLunarMonthDays(2018, 1)).to.equal(29);
    expect(() => service.getLunarMonthDays(1898, 1)).throw();
    expect(() => service.getLunarMonthDays(2052, 1)).throw();
    expect(service.getLunarMonthDays(1900, 8)).to.equal(30);
    expect(service.getLunarMonthDays(1900, 8, true)).to.equal(29);
    expect(() => service.getLunarMonthDays(2018, 1, true)).throw();
  });

  it('shuold translate day num to chinese', () => {
    expect(service.translateDayNumToCalendarStr(1)).to.equal('初一');
    expect(service.translateDayNumToCalendarStr(10)).to.equal('初十');
    expect(service.translateDayNumToCalendarStr(12)).to.equal('十二');
    expect(service.translateDayNumToCalendarStr(20)).to.equal('二十');
    expect(service.translateDayNumToCalendarStr(22)).to.equal('廿二');
    expect(service.translateDayNumToCalendarStr(30)).to.equal('三十');
    expect(() => service.translateDayNumToCalendarStr(31)).throw();
    expect(() => service.translateDayNumToCalendarStr(0)).throw();
  });

  it('should return safety scope of year', () => {
    expect(service.getScopeOfLunarYear()).equal({startYear: 1900, endYear: 2050});
  });

});

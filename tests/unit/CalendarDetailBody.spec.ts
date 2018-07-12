import * as sinon from 'sinon';
import CalendarDetailBody from '@/components/children/CalendarDetailBody.vue';
import { Wrapper, shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import { IScheduleList } from '@/index.type';

describe('Calendar Body Component Test', () => {

  let wrapper: Wrapper<CalendarDetailBody>;
  const props = {
    year: 2014,
    month: 7,
    day: 15,
    scheduleIconColor: '#ccc',
    showSchedule: false,
  };

  const lunarDayNumberToStrData: { [key: number]: string } = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九',
    10: '十',
    20: '廿',
    30: '三十',
  };

  const lunarData = {
    translateDayNumToCalendarStr(day: number): string {
      switch (true) {
        case (day <= 10):
          return '初' + lunarDayNumberToStrData[day];
        case (day < 20):
          return `${lunarDayNumberToStrData[10]}${lunarDayNumberToStrData[day % 10]}`;
        case (day === 20):
          return `${lunarDayNumberToStrData[2]}${lunarDayNumberToStrData[10]}`;
        case (day < 30):
          return `${lunarDayNumberToStrData[20]}${lunarDayNumberToStrData[day % 10]}`;
        case (day === 30):
          return lunarDayNumberToStrData[30];
        default:
          throw new Error('LunarCalendarData: translateDayNumToCalendarStr: 参数day必须是大于0小于31,当前day: ' + day);
      }
    },
    getLunarMonthAndDay(year: number, month: number, day: number) {
      switch (true) {
        case (year === 2014 && month === 7 && day === 1):
          return {
            month: 6,
            monthStr: '六月',
            day: 5,
            dayStr: '初五',
            currentMonthDaysNum: 30,
            isLeapMonth: false,
            isLeapYear: false,
            chineseEra: {
              heavenlyStems: 0,
              earthlyBranches: 6,
              era: '甲午',
              chineseZodiacAnimal: '马年',
            },
          };
        case (year === 2014 && month === 6 && day === 30):
          return {
            month: 6,
            monthStr: '六月',
            day: 4,
            dayStr: '初四',
            currentMonthDaysNum: 30,
            isLeapMonth: false,
            isLeapYear: false,
            chineseEra: {
              heavenlyStems: 0,
              earthlyBranches: 6,
              era: '甲午',
              chineseZodiacAnimal: '马年',
            },
          };
        case (year === 2014 && month === 7 && day === 27):
          return {
            month: 7,
            monthStr: '七月',
            day: 1,
            dayStr: '初一',
            currentMonthDaysNum: 29,
            isLeapMonth: false,
            isLeapYear: false,
            chineseEra: {
              heavenlyStems: 0,
              earthlyBranches: 6,
              era: '甲午',
              chineseZodiacAnimal: '马年',
            },
          };
        case (year === 2014 && month === 8 && day === 1):
          return {
            month: 7,
            monthStr: '七月',
            day: 6,
            dayStr: '初六',
            currentMonthDaysNum: 29,
            isLeapMonth: false,
            isLeapYear: false,
            chineseEra: {
              heavenlyStems: 0,
              earthlyBranches: 6,
              era: '甲午',
              chineseZodiacAnimal: '马年',
            },
          };
        default:
          return {
            month: 1,
            monthStr: '一月',
            day: 1,
            dayStr: '初一',
            currentMonthDaysNum: 29,
            isLeapMonth: false,
            isLeapYear: false,
            chineseEra: {
              heavenlyStems: 0,
              earthlyBranches: 6,
              era: '甲午',
              chineseZodiacAnimal: '马年',
            },
          };
      }
    },
    getScopeOfLunarYear() {
      return {
        startYear: 1900,
        endYear: 2050,
      };
    },
  };

  beforeEach(() => {
    wrapper = shallowMount(CalendarDetailBody, {
      propsData: {
        ...props,
      },
      mocks: {
        lunarData,
      },
    });
  });

  it('component should have a div with class ".body-wrapper" and have a table in it', () => {
    const bodyWrapperDiv = wrapper.find('.body-wrapper');
    expect(bodyWrapperDiv).have.property('element');
    const table = bodyWrapperDiv.find('table');
    expect(table).have.property('element');
    const tbody = table.find('tbody');
    expect(tbody).have.property('element');
    const trs = tbody.findAll('tr');
    expect(trs.length).eq(6);
  });

  it('component should have the table header', () => {
    const headerTr = wrapper.findAll('tr').at(0);
    const chineseWeek = ['一', '二', '三', '四', '五', '六', '日'];
    const tds = headerTr.findAll('th');
    for (let i = 0; i < tds.length; i++) {
      expect(tds.at(i).text().trim()).eq(chineseWeek[i]);
    }
  });

  it('component should have the day number and lunar calendar text in the td', () => {
    const firstTd = wrapper.findAll('tr').at(1).findAll('td').at(0);
    const dayWrapperDiv = firstTd.find('.day-wrapper');
    expect(dayWrapperDiv.classes().includes('isNotInCurrentMonth')).eq(true);
    const numberSpan = dayWrapperDiv.find('.number');
    expect(numberSpan).have.property('element');
    expect(numberSpan.text().trim()).eq('30');
    const lunarTextSpan = dayWrapperDiv.find('.lunar-text');
    expect(lunarTextSpan.text().trim()).eq('初四');
  });

  it('component should have the class "isWeekend" on the ".day-wrapper" div when the day is weekend', () => {
    const dayOf705 = wrapper.findAll('tr').at(1).findAll('td').at(5);
    const dayWrapperDiv = dayOf705.find('.day-wrapper');
    expect(dayWrapperDiv.classes().includes('isWeekend')).eq(true);
    const numberSpan = dayWrapperDiv.find('.number');
    expect(numberSpan).have.property('element');
    expect(numberSpan.text().trim()).eq('5');
    const lunarTextSpan = dayWrapperDiv.find('.lunar-text');
    expect(lunarTextSpan.text().trim()).eq('初九');
  });

  it('component should jump to next lunar month when the day after the last day of prev month last day', () => {
    const dayOf727 = wrapper.findAll('tr').at(4).findAll('td').at(6);
    const dayWrapperDiv = dayOf727.find('.day-wrapper');
    const numberSpan = dayWrapperDiv.find('.number');
    expect(numberSpan).have.property('element');
    expect(numberSpan.text().trim()).eq('27');
    const lunarTextSpan = dayWrapperDiv.find('.lunar-text');
    expect(lunarTextSpan.text().trim()).eq('初一');
  });

  it('component should have the next month day in the calendar', () => {
    const dayOf803 = wrapper.findAll('tr').at(5).findAll('td').at(6);
    const dayWrapperDiv = dayOf803.find('.day-wrapper');
    const numberSpan = dayWrapperDiv.find('.number');
    expect(numberSpan).have.property('element');
    expect(numberSpan.text().trim()).eq('3');
    const lunarTextSpan = dayWrapperDiv.find('.lunar-text');
    expect(lunarTextSpan.text().trim()).eq('初八');
  });

  it('component should have the schedule icon when there are schedule in then "day-wrapper"', () => {
    const colorHextoRgb = (color: string) => {
      let red;
      let green;
      let blue;
      if (color.length === 4) {
        red = color.slice(1, 2).repeat(2);
        green = color.slice(2, 3).repeat(2);
        blue = color.slice(3, 4).repeat(2);
      } else {
        red = color.slice(1, 3);
        green = color.slice(3, 5);
        blue = color.slice(5);
      }
      const afterRed = Number.parseInt(red, 16);
      const afterGreen = Number.parseInt(green, 16);
      const afterBlue = Number.parseInt(blue, 16);
      return `rgb(${afterRed}, ${afterGreen}, ${afterBlue})`;
    };
    const schedule: IScheduleList[] = [
      {
        year: 2014,
        month: 7,
        day: 10,
        schedules: [
          {
            startTime: '9:00',
            endTime: '10:00',
            description: '吃饭',
            iconColor: '#ccc',
          },
        ],
      },
    ];
    wrapper = shallowMount(CalendarDetailBody, {
      propsData: {
        ...props,
        schedules: schedule,
      },
      mocks: {
        lunarData,
      },
    });
    const dayOf710 = wrapper.findAll('tr').at(2).findAll('td').at(3);
    const dayWrapperDiv = dayOf710.find('.day-wrapper');
    const numberSpan = dayWrapperDiv.find('.number');
    expect(numberSpan).have.property('element');
    expect(numberSpan.text().trim()).eq('10');
    const lunarTextSpan = dayWrapperDiv.find('.lunar-text');
    expect(lunarTextSpan.text().trim()).eq('十四');
    let scheduleIcon = dayWrapperDiv.find('.schedule-icon');
    expect(scheduleIcon).not.have.property('element');

    wrapper.setProps({
      showSchedule: true,
    });
    scheduleIcon = dayWrapperDiv.find('.schedule-icon');
    expect(scheduleIcon).have.property('element');
    const icon = scheduleIcon.find('i');
    expect(icon).have.property('element');
    expect(icon.element.style.backgroundColor).eq(colorHextoRgb('#ccc'));
  });

  it('component should send new date to parent component when some td was clicked', () => {
    const updateDateSpy = sinon.fake();
    wrapper.vm.$on('updateDate', updateDateSpy);
    const dayOf705 = wrapper.findAll('tr').at(1).findAll('td').at(5);
    dayOf705.trigger('click');
    expect(updateDateSpy.calledWith({ year: 2014, month: 7, day: 5 })).eq(true);
  });

  it('component should update the "year" an "month" of property when the props changed', () => {
    expect((wrapper.vm as any).currentYear).eq(2014);
    expect((wrapper.vm as any).currentMonth).eq(7);
    wrapper.setProps({
      year: 1950,
      month: 9,
    });
    expect((wrapper.vm as any).currentYear).eq(1950);
    expect((wrapper.vm as any).currentMonth).eq(9);
  });

});

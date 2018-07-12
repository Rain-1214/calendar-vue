import Schedule from '@/components/children/Schedule.vue';
import { Wrapper, shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import { IScheduleList } from '@/index.type';

describe('Schedule Component test', () => {

  let wrapper: Wrapper<Schedule>;
  const props = {
    day: 5,
    month: 6,
    schedule: [],
    year: 2018,
  };
  const lunarDate = {
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

  beforeEach(() => {
    wrapper = shallowMount(Schedule, {
      propsData: {
        ...props,
      },
      mocks: {
        lunarData: {
          getLunarMonthAndDay() {
            return lunarDate;
          },
        },
      },
    });
  });

  it('component shoule have a div with class ".schedule", then there are ".header" div and ".list" div in it', () => {
    const scheduleDiv = wrapper.find('.schedule');
    expect(scheduleDiv).have.property('element');
    const headerDiv = scheduleDiv.find('.header');
    expect(headerDiv).have.property('element');
    const listDiv = scheduleDiv.find('.list');
    expect(listDiv).have.property('element');
  });

  it('component should init the state of "currentDate" and "lunarData"', () => {
    expect((wrapper.vm as any).lunarData).deep.eq(lunarDate);
    expect((wrapper.vm as any).currentDate).deep.eq(new Date(2018, 5, 5));
  });

  it('component should show the detail message of "currentDate"', () => {
    const headerDiv = wrapper.findAll('.header div');
    const fisrtDiv = headerDiv.at(0);
    expect(fisrtDiv.text().trim()).eq('2018-6-5 星期二');
    const secondDiv = headerDiv.at(1);
    expect(secondDiv.classes().includes('day')).eq(true);
    expect(secondDiv.text().trim()).eq('5');
    const thirdDiv = headerDiv.at(2);
    expect(thirdDiv.text().trim()).eq('戊戌年 狗年');
    const forthDiv = headerDiv.at(3);
    expect(forthDiv.text().trim()).eq('四月廿二');
    wrapper.setData({
      lunarData: {
        ...lunarDate,
        isLeapMonth: true,
      },
    });
    expect(forthDiv.text().trim()).eq('闰四月廿二');
  });

  it('component show schedule list in ".list" div or show ".empty" li when schedule is empty', () => {
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
    const listDiv = wrapper.find('.list');
    const titleDiv = listDiv.find('.title');
    expect(titleDiv.text().trim()).eq('今日日程');
    const listUl = listDiv.find('ul');
    expect(listUl).have.property('element');
    const emptyLi = listUl.find('li');
    expect(emptyLi.classes().includes('empty')).eq(true);
    expect(emptyLi.text().trim()).eq('暂无日程');
    const schedule: IScheduleList[] = [
      {
        day: 5,
        month: 6,
        schedules: [
          {
            startTime: '9:00',
            endTime: '10:00',
            description: '吃饭',
            iconColor: '#ccc',
          },
          {
            startTime: '9:00',
            endTime: '10:00',
            description: '睡觉',
            iconColor: '#ccc',
          },
        ],
        year: 2018,
      },
    ];
    wrapper = shallowMount(Schedule, {
      propsData: {
        ...props,
        schedule,
      },
    });
    const afterChangeListLi = wrapper.findAll('.list ul li');
    expect(afterChangeListLi.length).eq(2);
    for (let i = 0; i < afterChangeListLi.length; i++) {
      const e = afterChangeListLi.at(i);
      const tempScheduleList = schedule[0].schedules[i];
      const timeDiv = e.find('.time');
      expect(timeDiv).have.property('element');
      expect(timeDiv.text().trim()).eq(`${tempScheduleList.startTime} - ${tempScheduleList.endTime}`);
      const iconI = e.find('i');
      expect(iconI.classes().includes('icon')).eq(true);
      expect(iconI.element.style.backgroundColor).eq(colorHextoRgb(tempScheduleList.iconColor));
      const descriptionDiv = e.find('.description');
      expect(descriptionDiv).have.property('element');
      expect(descriptionDiv.text().trim()).eq(tempScheduleList.description);
    }

  });

});

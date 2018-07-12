import { shallowMount, Wrapper, mount } from '@vue/test-utils';
import Calendar from '@/components/Calendar.vue';
import { expect } from 'chai';
import { IScheduleList } from '@/index.type';
import sinon from 'sinon';

describe('Calendar Component Test', () => {

  let wrapper: Wrapper<Calendar>;

  beforeEach(() => {
    wrapper = shallowMount(Calendar);
  });

  it('component should have a div with class ".calendar-wrapper"', () => {
    const calendarWrapperDiv = wrapper.find('.calendar-wrapper');
    expect(calendarWrapperDiv).have.property('element');
    expect(calendarWrapperDiv.element.style.width).equal('550px');
    wrapper.setProps({ width: 800 });
    expect(calendarWrapperDiv.element.style.width).equal('800px');
  });

  it('component should have ".calendar-detail-wrapper" and ".schedule-wrapper" div in ".calendar-wrapper"', () => {
    const calendarWrapperDiv = wrapper.find('.calendar-wrapper');
    expect(calendarWrapperDiv).have.property('element');
    const calendarDetailWrapperDiv = calendarWrapperDiv.find('.calendar-detail-wrapper');
    expect(calendarDetailWrapperDiv).have.property('element');
    const scheduleWrapperDiv = calendarWrapperDiv.find('.schedule-wrapper');
    expect(scheduleWrapperDiv).have.property('element');
  });

  it('component should have ".header" div and ".body" div in ".calendar-detail-wrapper"', () => {
    const calendarDetailWrapperDiv = wrapper.find('.calendar-detail-wrapper');
    const headerDiv = calendarDetailWrapperDiv.find('.header');
    expect(headerDiv).have.property('element');
    const bodyDiv = calendarDetailWrapperDiv.find('.body');
    expect(bodyDiv).have.property('element');
  });

  it('there are children component in ".header",".body" and ".schedule-wrapper"', () => {
    const headerDiv = wrapper.find('.header');
    expect(headerDiv.element.children.length).eq(1);

    const bodyDiv = wrapper.find('.body');
    expect(bodyDiv.element.children.length).eq(1);

    const scheduleWrapper = wrapper.find('.schedule-wrapper');
    expect(scheduleWrapper.element.children.length).eq(1);
  });

  it('component should init default props when creared it', () => {
    const schedule: IScheduleList[] = [
      {
        day: 2,
        month: 6,
        schedules: [
          {
            description: '吃饭',
            endTime: '11:00',
            iconColor: '#000',
            startTime: '10:00',
          },
        ],
        year: 1929,
      },
    ];
    wrapper = shallowMount(
      Calendar,
      {
        propsData: {
          day: 12,
          month: 8,
          schedule,
          scheduleIconColor: '#ccc',
          showSchedule: true,
          showToday: false,
          width: 800,
          year: 1999,
        },
      },
    );
    const props = wrapper.props();
    expect(props).to.deep.eq({
      day: 12,
      month: 8,
      schedule,
      scheduleIconColor: '#ccc',
      showSchedule: true,
      showToday: false,
      width: 800,
      year: 1999,
    });
  });

  it('component should set state of "day","month" and "year" to today when method of "returnToday" called', () => {
    wrapper.setData({
      currentDay: 10,
      currentMonth: 2,
      currentYear: 1999,
    });
    const state = wrapper.vm.$data;
    expect(state.currentDay).eq(10);
    expect(state.currentMonth).eq(2);
    expect(state.currentYear).eq(1999);
    (wrapper.vm as any).returnToday();
    const today = new Date();
    expect(state.currentDay).eq(today.getDate());
    expect(state.currentMonth).eq(today.getMonth() + 1);
    expect(state.currentYear).eq(today.getFullYear());
  });

  it('component send "year","month" and "day" to parent by the method of "props" updateDate when them changed', () => {
    const updateDateSpy = sinon.fake();
    wrapper.vm.$on('receiveDate', updateDateSpy);
    const mockParamer = {
      day: 1,
      month: 1,
      year: 1950,
    };
    (wrapper.vm as any).updateDate(mockParamer);
    expect(updateDateSpy.calledWith(mockParamer)).eq(true);
  });

});

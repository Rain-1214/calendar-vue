import * as sinon from 'sinon';
import CalendarDetailHeader from '@/components/children/CalendarDetailHeader.vue';
import { Wrapper, shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

describe('Calendar Detail Header Component test', () => {

  let wrapper: Wrapper<CalendarDetailHeader>;

  beforeEach(() => {
    wrapper = shallowMount(CalendarDetailHeader, {
      propsData: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      mocks: {
        lunarCalendarDataService: {
          getScopeOfLunarYear() {
            return {
              startYear: 1900,
              endYear: 2050,
            };
          },
        },
      },
    });
  });

  it('component should have a div with "calendar-header" and have three div in it', () => {
    const calendarHeaderDiv = wrapper.find('.calendar-header');
    expect(calendarHeaderDiv).have.property('element');
    expect(calendarHeaderDiv.element.children.length).eq(3);
  });

  it('component should have a "prev" div and "next" div in the second div', () => {
    const divs = wrapper.findAll('.calendar-header>div');
    const secondDiv = divs.at(1);
    const prevBtn = secondDiv.find('.prev');
    expect(prevBtn).have.property('element');
    expect(prevBtn.classes().includes('icon')).eq(true);
    const nextBtn = secondDiv.find('.next');
    expect(nextBtn).have.property('element');
    expect(nextBtn.classes().includes('icon')).eq(true);
  });

  it('component should set prev month when ".prev" clicked', () => {
    const today = new Date();
    const btn = wrapper.find('.prev');
    const updateDateSpy = sinon.fake();
    wrapper.vm.$on('updateDate', updateDateSpy);
    btn.trigger('click');
    if ((wrapper.vm as any).currentMonth !== 1) {
      expect((wrapper.vm as any).currentMonth).eq(today.getMonth());
      expect(updateDateSpy.calledWith({ year: today.getFullYear(), month: today.getMonth() })).eq(true);
    } else {
      expect((wrapper.vm as any).currentMonth).eq(12);
      expect((wrapper.vm as any).currentYear).eq(today.getFullYear() - 1);
    }
    wrapper.setData({
      currentMonth: 1,
      currentYear: 1950,
    });
    btn.trigger('click');
    expect((wrapper.vm as any).currentMonth).eq(12);
    expect((wrapper.vm as any).currentYear).eq(1949);
    expect(updateDateSpy.calledWith({ year: 1949, month: 12 })).eq(true);
    wrapper.setData({
      currentYear: 1900,
      currentMonth: 1,
    });
    btn.trigger('click');
    expect((wrapper.vm as any).currentMonth).eq(1);
    expect((wrapper.vm as any).currentYear).eq(1900);
  });

  it('component should set next month when ".next" clicked', () => {
    const today = new Date();
    const btn = wrapper.find('.next');
    const updateDateSpy = sinon.fake();
    wrapper.vm.$on('updateDate', updateDateSpy);
    btn.trigger('click');
    if ((wrapper.vm as any).currentMonth !== 12) {
      expect((wrapper.vm as any).currentMonth).eq(today.getMonth() + 2);
      expect(updateDateSpy.calledWith({ year: today.getFullYear(), month: today.getMonth() + 2 })).eq(true);
    } else {
      expect((wrapper.vm as any).currentMonth).eq(1);
      expect((wrapper.vm as any).currentYear).eq(today.getFullYear() + 1);
    }
    wrapper.setData({
      currentMonth: 12,
      currentYear: 1950,
    });
    btn.trigger('click');
    expect((wrapper.vm as any).currentMonth).eq(1);
    expect((wrapper.vm as any).currentYear).eq(1951);
    expect(updateDateSpy.calledWith({ year: 1951, month: 1 })).eq(true);
    wrapper.setData({
      currentMonth: 12,
      currentYear: 2050,
    });
    btn.trigger('click');
    expect((wrapper.vm as any).currentYear).eq(2050);
    expect((wrapper.vm as any).currentMonth).eq(12);
  });

  it('component should have a year dropdown component in the first div of ".calendar-header"', () => {
    const updateDateSpy = sinon.fake();
    wrapper.vm.$on('updateDate', updateDateSpy);
    expect((wrapper.vm as any).currentYear).eq(new Date().getFullYear());
    (wrapper.vm as any).receiveDate('year', 1950);
    expect((wrapper.vm as any).currentYear).eq(1950);
    expect(updateDateSpy.calledWith({ year: 1950, month: (wrapper.vm as any).month })).eq(true);
  });

  it('component should have a month dropdown component in the second div of ".calendar-header"', () => {
    const today = new Date();
    const updateDateSpy = sinon.fake();
    wrapper.vm.$on('updateDate', updateDateSpy);
    expect((wrapper.vm as any).currentMonth).eq(today.getMonth() + 1);
    (wrapper.vm as any).receiveDate('month', 6);
    expect((wrapper.vm as any).currentMonth).eq(6);
    expect(updateDateSpy.calledWith({ year: today.getFullYear(), month: 6 })).eq(true);
  });

  it('component should set "year" or "month" of state when "year" or "month" of props change', () => {
    const today = new Date();
    expect((wrapper.vm as any).month).eq(today.getMonth() + 1);
    expect((wrapper.vm as any).year).eq(today.getFullYear());
    wrapper.setProps({
      year: 1950,
      month: 1,
    });
    expect((wrapper.vm as any).month).eq(1);
    expect((wrapper.vm as any).year).eq(1950);
  });

});

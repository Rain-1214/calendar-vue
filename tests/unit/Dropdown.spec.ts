import * as sinon from 'sinon';
import Dropdown from '@/components/common/Dropdown.vue';
import MinScroll from '@/components/common/Minscroll.vue';
import { Wrapper, mount, shallowMount } from '@vue/test-utils';
import { IListData } from '@/index.type';
import { expect } from 'chai';

describe('Dropdown component test', () => {

  let wrapper: Wrapper<Dropdown>;
  const listData: IListData[] = [];
  let i = 0;
  while (i <= 10) {
    listData.push({
      label: `test${i}`,
      value: i,
    });
    i++;
  }

  beforeEach(() => {
    wrapper = shallowMount(Dropdown, {
      propsData: {
        listData,
        value: '',
      },
    });
  });

  it('component should have a div with class ".dropdown-wrapper" and set width', () => {
    let dropdownWrapper = wrapper.find('.dropdown-wrapper');
    expect(dropdownWrapper).have.property('element');
    expect(dropdownWrapper.element.style.width).eq('80px');
    wrapper.setProps({
      width: 200,
    });
    dropdownWrapper = wrapper.find('.dropdown-wrapper');
    expect(dropdownWrapper.element.style.width).eq('200px');
  });

  it('component should haive "dropdown-btn" and "value" in "dropdown-wrapper"', () => {
    const dropdownBtn = wrapper.find('.dropdown-btn');
    expect(dropdownBtn).have.property('element');
    const dropdownBtnIcon = dropdownBtn.find('.icon-down');
    expect(dropdownBtnIcon).have.property('element');
    let value = wrapper.find('.value');
    expect(value).have.property('element');
    expect(value.text().trim()).eq('待选择');
    wrapper.setProps({
      value: 'test-1',
    });
    value = wrapper.find('.value');
    expect(value.text().trim()).eq('test-1');
  });

  it('component should have a div with "dropdown-list" and should have data list in it', () => {
    wrapper = mount(Dropdown, {
      propsData: {
        maxHeight: 200,
        value: '',
        listData,
      },
    });
    const dropdownList = wrapper.find('.dropdown-list');
    expect(dropdownList).have.property('element');
    expect(dropdownList.attributes().hidden).eq('hidden');
    const listUl = dropdownList.find('ul');
    expect(listUl).have.property('element');
    const listLis = listUl.findAll('li');
    expect(listLis.length).eq(listData.length);
    for (let j = 0; j < listData.length; j++) {
      expect(listLis.at(j).text().trim()).eq(listData[j].label);
    }
  });

  it('componet should show "dropdown-list" when "dropdown-btn" or "value" clicked', () => {
    wrapper = mount(Dropdown, {
      propsData: {
        value: '',
        maxHeight: 200,
        listData,
      },
    });
    let dropdownList = wrapper.find('.dropdown-list');
    expect(dropdownList.attributes().hidden).eq('hidden');

    const valueDiv = wrapper.find('.value');
    const dropdownBtn = wrapper.find('.dropdown-btn');
    const minscrollInstance = wrapper.vm.$children[0] as any;
    minscrollInstance.sourceHeight = 24 * 11;
    minscrollInstance.maxScrollBarDistance = 170;
    minscrollInstance.maxScrollElementDistance = 24 * 11 - 200;

    valueDiv.trigger('click', { stopPropagation: () => {} });
    dropdownList = wrapper.find('.dropdown-list');
    expect(dropdownList.element.hidden).eq(true);
    const scrollElement = wrapper.find('.scroll-element');
    const scrollBar = wrapper.find('.bar');
    expect(scrollElement.element.style.top).eq('0px');
    expect(scrollBar.element.style.top).eq('0px');

    dropdownBtn.trigger('click', { stopPropagation: () => {} });
    dropdownList = wrapper.find('.dropdown-list');
    expect(dropdownList.element.hidden).eq(true);

  });

  it('component should set state of "value" and send value to parent component when li clicked,if props pass "updateDate" function', () => {
    wrapper = mount(Dropdown, {
      propsData: {
        value: '',
        maxHeight: 200,
        listData,
      },
    });
    const updateDateSyp = sinon.fake();
    wrapper.vm.$on('updateValue', updateDateSyp);
    const lis = wrapper.findAll('li');
    lis.at(0).trigger('mouseup');
    expect((wrapper.vm as any).currentValue).eq(listData[0].value);
    expect(updateDateSyp.calledWith(listData[0].value)).eq(true);

    lis.at(5).trigger('mouseup');
    expect((wrapper.vm as any).currentValue).eq(listData[5].value);
    expect(updateDateSyp.calledWith(listData[5].value)).eq(true);

  });

  it('component set state of "value" when "value" of props changes', () => {
    expect((wrapper.vm as any).currentValue).eq('待选择');
    wrapper.setProps({
      value: 'test-12',
    });
    expect((wrapper.vm as any).currentValue).eq('test-12');
    wrapper.setProps({
      value: '',
    });
    expect((wrapper.vm as any).currentValue).eq('待选择');
  });

  it('component should close data list when document is clicked and "globalClickClose" of props is true', () => {
    wrapper = mount(Dropdown, {
      propsData: {
        globalClickClose: true,
        value: '',
        maxHeight: 200,
        listData,
      },
    });
    const minscrollInstance = wrapper.vm.$children[0] as any;
    minscrollInstance.sourceHeight = 24 * 11;
    minscrollInstance.maxScrollBarDistance = 170;
    minscrollInstance.maxScrollElementDistance = 24 * 11 - 200;

    const value = wrapper.find('.value');
    value.trigger('mouseup', { stopPropagation: () => {} });
    const dropdownList = wrapper.find('.dropdown-list');
    expect(dropdownList.element.hidden).eq(false);

    document.dispatchEvent(new MouseEvent('mousedown'));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(dropdownList.element.hidden).eq(true);
  });

});

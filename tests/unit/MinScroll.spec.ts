
import MinScroll from '@/components/common/MinScroll.vue';
import { Wrapper, shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

describe('MinScroll component test', () => {

  let wrapper: Wrapper<MinScroll>;

  beforeEach(() => {
    wrapper = shallowMount(MinScroll, {
      slots: {
        default: '<div style="height: 1500px"></div>',
      },
    });
  });

  it('component should have div with class ".min-scroll-bar-wrapper" and maybe have class "hasScroll"', () => {
    const wrapperDiv = wrapper.find('.min-scroll-bar-wrapper');
    expect(wrapperDiv).have.property('element');
    expect(wrapperDiv.element.classList.contains('hasScroll')).eq(false);
    wrapper.setData({
      sourceHeight: 1500,
    });
    wrapper.setProps({
      maxHeight: 200,
    });
    expect(wrapperDiv.element.classList.contains('hasScroll')).eq(true);
  });

  it('component should have ".scroll-wrapper" and ".scroll-element" in ".min-scroll-bar-wrapper"', () => {
    const wrapperDiv = wrapper.find('.min-scroll-bar-wrapper');
    const scrollWrapperDiv = wrapperDiv.find('.scroll-wrapper');
    expect(scrollWrapperDiv).have.property('element');
    expect(scrollWrapperDiv.element.style.maxHeight).eq(Number.MAX_SAFE_INTEGER + 'px');
    const scrollElementDiv = wrapperDiv.find('.scroll-element');
    expect(scrollElementDiv).have.property('element');
    expect(scrollElementDiv.element.style.top).eq('0px');
    wrapper.setProps({
      maxHeight: 200,
    });
    expect(scrollWrapperDiv.element.style.maxHeight).eq('200px');
  });

  it('component should have ".scroll-bar" and ".bar" in ".min-scroll-bar-wrapper"', () => {
    const wrapperDiv = wrapper.find('.min-scroll-bar-wrapper');
    const scrollBar = wrapperDiv.find('.scroll-bar');
    expect(scrollBar).have.property('element');
    const bar = scrollBar.find('.bar');
    expect(bar).have.property('element');
    expect(bar.element.style.top).eq('0px');
  });

  it('component should set scroll distance when mouseWheel event called on ".min-scroll-bar-wrapper"', () => {
    wrapper.setProps({
      maxHeight: 200,
    });
    wrapper.setData({
      sourceHeight: 1500,
      maxScrollBarDistance: 170,
      maxScrollElementDistance: 1300,
    });
    const scrollStep = 50;
    const wrapperDiv = wrapper.find('.min-scroll-bar-wrapper');
    wrapperDiv.trigger('mousewheel', { deltaY: 10 });
    const scrollElementDiv = wrapper.find('.scroll-element');
    expect(scrollElementDiv.element.style.top).eq(-scrollStep + 'px');

    wrapperDiv.trigger('mousewheel', { deltaY: 10 });
    expect(scrollElementDiv.element.style.top).eq(-scrollStep * 2 + 'px');

    wrapperDiv.trigger('mousewheel', { deltaY: -10 });
    wrapperDiv.trigger('mousewheel', { deltaY: -10 });
    wrapperDiv.trigger('mousewheel', { deltaY: -10 });
    wrapperDiv.trigger('mousewheel', { deltaY: -10 });
    expect(scrollElementDiv.element.style.top).eq('0px');

    for (let i = 0; i < 1300 / scrollStep; i ++) {
      wrapperDiv.trigger('mousewheel', { deltaY: 10 });
    }
    expect(scrollElementDiv.element.style.top).eq('-1300px');

    wrapperDiv.trigger('mousewheel', { deltaY: 10 });
    wrapperDiv.trigger('mousewheel', { deltaY: 10 });
    expect(scrollElementDiv.element.style.top).eq('-1300px');
  });


  it('component should set scroll distance when click the "scroll-bar"', () => {
    wrapper.setProps({
      maxHeight: 200,
    });
    wrapper.setData({
      sourceHeight: 1500,
      maxScrollBarDistance: 170,
      maxScrollElementDistance: 1300,
    });
    const scrollBar = wrapper.find('.scroll-bar');
    scrollBar.trigger('click', { offsetY: 100  });
    const scrollElementDiv = wrapper.find('.scroll-element');
    const bar = wrapper.find('.bar');
    expect(scrollElementDiv.element.style.top).eq(-((100 - 15) / 170 * 1300) + 'px');
    expect(bar.element.style.top).eq('85px');

    scrollBar.trigger('click', { offsetY: 0 } );
    expect(scrollElementDiv.element.style.top).eq('0px');
    expect(bar.element.style.top).eq('0px');

    scrollBar.trigger('click', { offsetY: 200  });
    expect(scrollElementDiv.element.style.top).eq('-1300px');
    expect(bar.element.style.top).eq('170px');
  });


  it('component should set scroll distance when drag the "bar"', () => {
    wrapper = shallowMount(MinScroll, {
      propsData: {
        maxHeight: 200,
      },
    });
    wrapper.setData({
      sourceHeight: 1500,
      maxScrollBarDistance: 170,
      maxScrollElementDistance: 1300,
    });
    const bar = wrapper.find('.bar');
    bar.trigger('mousedown', {
      stopPropagation: () => {},
      clientY: 10,
    });


    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 100, preventDefault: () => {} } as any ));
    const scrollElementDiv = wrapper.find('.scroll-element');
    expect(bar.element.style.top).eq('90px');
    expect(scrollElementDiv.element.style.top).eq(-(90 / 170 * 1300) + 'px');

    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 500 }));
    expect(bar.element.style.top).eq('170px');
    expect(scrollElementDiv.element.style.top).eq(-1300 + 'px');

    document.dispatchEvent(new MouseEvent('mousemove', { clientY: -500 }));
    expect(bar.element.style.top).eq('0px');
    expect(scrollElementDiv.element.style.top).eq('0px');

    bar.trigger('mouseup', { stopPropagation: () => {} });
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 100 }));
    expect(bar.element.style.top).eq('0px');
    expect(scrollElementDiv.element.style.top).eq('0px');

  });
});

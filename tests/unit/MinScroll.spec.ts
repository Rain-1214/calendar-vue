
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

  // it('component should set scroll distance when mouseWheel event called on ".min-scroll-bar-wrapper"', () => {
  //   wrapper.setProps({
  //     maxHeight: 200
  //   });
  //   (wrapper.instance() as MinScroll).sourceHeight = 1500;
  //   (wrapper.instance() as MinScroll).maxScrollBarDistance = 170;
  //   (wrapper.instance() as MinScroll).maxScrollElementDistance = 1300;
  //   const scrollStep = 50;
  //   const wrapperDiv = wrapper.find('.min-scroll-bar-wrapper');
  //   wrapperDiv.simulate('wheel',{ deltaY: 10 });
  //   let scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-scrollStep);
  //   wrapperDiv.simulate('wheel',{ deltaY: 10 });
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-scrollStep * 2);
  //   wrapperDiv.simulate('wheel',{ deltaY: -10 });
  //   wrapperDiv.simulate('wheel',{ deltaY: -10 });
  //   wrapperDiv.simulate('wheel',{ deltaY: -10 });
  //   wrapperDiv.simulate('wheel',{ deltaY: -10 });
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(0);
  //   for(let i = 0; i < 1300 / scrollStep; i ++) {
  //     wrapperDiv.simulate('wheel',{ deltaY: 10 });
  //   }
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-1300);
  //   wrapperDiv.simulate('wheel',{ deltaY: 10 });
  //   wrapperDiv.simulate('wheel',{ deltaY: 10 });
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-1300);
  // });


  // it('component should set scroll distance when click the "scroll-bar"', () => {
  //   wrapper.setProps({
  //     maxHeight: 200
  //   });
  //   (wrapper.instance() as MinScroll).sourceHeight = 1500;
  //   (wrapper.instance() as MinScroll).maxScrollBarDistance = 170;
  //   (wrapper.instance() as MinScroll).maxScrollElementDistance = 1300;
  //   const scrollBar = wrapper.find('.scroll-bar');
  //   scrollBar.simulate('click', { nativeEvent: { offsetY: 100 } });
  //   let scrollElementDiv = wrapper.find('.scroll-element');
  //   let bar = wrapper.find('.bar');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-((100 - 15) / 170 * 1300));
  //   expect((bar.props().style as React.CSSProperties).top).toBe(85);
  //   scrollBar.simulate('click', { nativeEvent: { offsetY: 0 } });
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   bar = wrapper.find('.bar');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-0);
  //   expect((bar.props().style as React.CSSProperties).top).toBe(0);
  //   scrollBar.simulate('click', { nativeEvent: { offsetY: 200 } });
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   bar = wrapper.find('.bar');
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-1300);
  //   expect((bar.props().style as React.CSSProperties).top).toBe(170);
  // });


  // it('component should set scroll distance when drag the "bar"', () => {
  //   wrapper.setProps({
  //     maxHeight: 200
  //   });
  //   (wrapper.instance() as MinScroll).sourceHeight = 1500;
  //   (wrapper.instance() as MinScroll).maxScrollBarDistance = 170;
  //   (wrapper.instance() as MinScroll).maxScrollElementDistance = 1300;
  //   let bar = wrapper.find('.bar');
  //   bar.simulate('mousedown', {
  //     // tslint:disable-next-line:no-empty
  //     stopPropagation: () => {},
  //     nativeEvent: {
  //       clientY: 10,
  //       // tslint:disable-next-line:no-empty
  //       stopPropagation: () => {},
  //       // tslint:disable-next-line:no-empty
  //       stopImmediatePropagation: () => {}
  //     }
  //   });

  //   document.dispatchEvent(new MouseEvent('mousemove', { clientY: 100 }));
  //   wrapper.update();
  //   bar = wrapper.find('.bar');
  //   let scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((bar.props().style as React.CSSProperties).top).toBe(90);
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-(90 / 170 * 1300));

  //   document.dispatchEvent(new MouseEvent('mousemove', { clientY: 500 }));
  //   wrapper.update();
  //   bar = wrapper.find('.bar');
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((bar.props().style as React.CSSProperties).top).toBe(170);
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-1300);

  //   document.dispatchEvent(new MouseEvent('mousemove', { clientY: -500 }));
  //   wrapper.update();
  //   bar = wrapper.find('.bar');
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((bar.props().style as React.CSSProperties).top).toBe(0);
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-0);

  //   bar.simulate('mouseup');

  //   document.dispatchEvent(new MouseEvent('mousemove', { clientY: 100 }));
  //   wrapper.update();
  //   bar = wrapper.find('.bar');
  //   scrollElementDiv = wrapper.find('.scroll-element');
  //   expect((bar.props().style as React.CSSProperties).top).toBe(0);
  //   expect((scrollElementDiv.props().style as React.CSSProperties).top).toBe(-0);

  // });
});

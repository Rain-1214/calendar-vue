<template>
  <div class="min-scroll-bar-wrapper">
    <div class="scroll-wrapper"
          :style="{
            maxHeight: maxHeight + 'px',
          }">
        <div class="scroll-element"
             :style="{
               top: scrollElementDistance
             }">
          <slot></slot>
        </div>
    </div>
    <div class="scroll-bar">
      <div class="bar"
            :style="{
              top: scrollBarDistance
            }" />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class MinScroll extends Vue {

  @Prop({ default: Number.MAX_SAFE_INTEGER }) public maxHeight!: number;

  /**
   * 指向滚动元素
   */
  public scrollWrapperRef!: HTMLElement;
  /**
   * 记录元素总高度
   */
  public sourceHeight = 0;
  /**
   * 滚动条可滚动的最大距离
   */
  public maxScrollBarDistance = 0;
  /**
   * 元素可滚动的最大距离
   */
  public maxScrollElementDistance = 0;
  /**
   * 滚动条的滚动滑块的高度
   */
  public scrollBarHeight = 30;
  /**
   * 每次滚动距离
   */
  public scrollStep = 50;
  /**
   * 鼠标移动时是否可以拖动滚动滑块
   */
  public canMove = false;
  /**
   * 记录拖动开始时鼠标的位置
   */
  public startMoveMouseDistance = 0;
  /**
   * 记录拖拽开始时滚动的位置
   */
  public startMoveScrollDistance = 0;

  public scrollElementDistance: number = 0;
  public scrollBarDistance: number = 0;

  public mounted() {
    this.scrollWrapperRef = this.$el.querySelector('.scroll-element') as HTMLElement;
    this.sourceHeight = this.scrollWrapperRef.clientHeight;
  }

}
</script>
<style lang="scss" scoped>
$bg-color-white:#fff;
$bg-color-gray:#aeaeae;
$bg-color-gray-light:#f2f2f2;

$border-color-gray:#e1e1e1;

.min-scroll-bar-wrapper{
  position: relative;
  overflow: hidden;
  &.hasScroll{
    padding-right: 10px;
  }
  .scroll-bar{
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    background: $bg-color-gray-light;
    cursor: pointer;
    &:hover{
      background: $bg-color-gray;
    }
    .bar{
      box-sizing: border-box;
      width: 8px;
      height: 30px;
      position: absolute;
      top: 0px;
      right: 1px;
      border: 1px solid $border-color-gray;
      background: $bg-color-white;
    }
  }
  .scroll-wrapper{
    position: relative;
    .scroll-element{
      position: relative;
    }
  }
}
</style>


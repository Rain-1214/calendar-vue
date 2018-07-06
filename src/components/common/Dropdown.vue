<template>
  <div class="dropdown-wrapper" :style="{width: width + 'px', display: display}" @mousedown="$event.stopPropagation()">
    <div class="value" @mouseup="triggleShowListData($event)">
      {{ value }}
    </div>
    <span class="dropdown-btn" @mouseup="triggleShowListData($event)">
      <i class="icon-down" />
    </span>
    <div class="dropdown-list" :hidden="!listVisible">
      <MinScroll :maxHeight="maxHeight">
        <ul>
          <li v-for="(v,i) in listData" :key="i" @mouseup="selectValue(v)">
            {{ v.label }}
          </li>
        </ul>
      </MinScroll>
    </div>
  </div>
</template>
<script lang="ts">

import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { IListData } from '@/index.type';
import MinScroll from './MinScroll.vue';

@Component({
  components: {
    MinScroll,
  },
})
export default class Dropdown extends Vue {

  @Prop({ default: 80 }) public width!: number;
  @Prop({ default: Number.MAX_SAFE_INTEGER }) public maxHeight!: number;
  @Prop({ default: 'inline-block' }) public display!: string;
  @Prop({ required: true }) public listData!: IListData[];
  @Prop({ default: true }) public globalClickClose!: boolean;
  @Prop({ default: '待选择' }) public placeholder!: string;
  @Prop({ type: [ String, Number ], required: true }) public value!: string | number;

  public currentValue: string | number = this.value || this.placeholder;
  public listVisible: boolean = false;
  public liHeight = 24;

  public mounted(event: MouseEvent) {
    if (this.globalClickClose) {
      let canClose = false;
      document.addEventListener('mousedown', () => {
        canClose = true;
      });
      document.addEventListener('mouseup', () => {
        if (canClose) {
          canClose = false;
          this.listVisible = false;
        }
      });
    }
  }

  public triggleShowListData(event: MouseEvent) {
    event.stopPropagation();
    this.listVisible = !this.listVisible;
    if (this.listVisible && this.currentValue) {
      const scrollDistance = this.listData.findIndex((e) => e.value === this.currentValue) * this.liHeight;
      this.$nextTick(() => {
        (this.$children[0] as MinScroll).setScrollElementDistance(-scrollDistance);
      });
    }
  }

  public selectValue(selectValue: IListData) {
    this.currentValue = selectValue.value;
    this.listVisible = false;
    this.updateValue(selectValue.value);
  }

  @Watch('value')
  public watchValue() {
    if (this.value !== this.currentValue) {
      this.currentValue = this.value;
    }
  }

  @Emit('updateValue')
  public updateValue(value: string | number) {}

}

</script>
<style lang="scss" scoped>

$border-color-gray:#bbb;
$border-color-light: #d9d9d9;

$icon-color: #898a8a;

$text-color: #333;

$bg-color-white: #fff;

$bg-color-gray: #f5f5f5;

.dropdown-wrapper{
  height: 26px;
  padding: 0 10px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  border: 1px solid $border-color-light;
  .value{
    display: inline-block;
    min-width: 54px;
    height: 100%;
    line-height: 24px;
    font-size: 12px;
    cursor: pointer;
  }
  .dropdown-btn{
    width: 24px;
    height: 24px;
    position: absolute;
    right: 0;
    top: 0;
    border-left: 1px solid $border-color-light;
    cursor: pointer;
    .icon-down{
      &::after{
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-top: 5px solid $icon-color;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -5px;
        margin-top: -2.5px;
      }
    }
  }
  .dropdown-list{
    box-sizing: border-box;
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    background: $bg-color-white;
    border: 1px solid $border-color-gray;
    ul{
      list-style-type: none;
      li{
        padding-left: 10px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        color: $text-color;
        cursor: pointer;
        &:hover{
          background: $bg-color-gray;
        }
        &.disabled{
          cursor: default;
          &:hover{
            background: $bg-color-white;
          }
        }
      }
    }
  }
}

</style>



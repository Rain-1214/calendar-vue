<template>
  <div class="dropdown-wrapper" :style="{width: width + 'px'}">
    <div class="value">
      {{ value }}
    </div>
    <span class="dropdown-btn" >
      <i class="icon-down" />
    </span>
    <div class="dropdown-list" :hidden="listVisible">
      <MinScroll :maxHeight="maxHeight">
        <ul>
          <li v-for="(v,i) in listData" :key="i">
            {{ v.label }}
          </li>
        </ul>
      </MinScroll>
    </div>
  </div>
</template>
<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';
import MinScroll from './MinScroll.vue';
import { IListData } from '@/index.type';

@Component({
  components: {
    MinScroll,
  },
})
export default class Dropdown extends Vue {

  @Prop({ default: 80 })
  public width!: number;
  @Prop({ default: Number.MAX_SAFE_INTEGER })
  public maxHeight!: number;
  @Prop({ default: 'inline-block' })
  public display!: string;
  @Prop({ required: true })
  public listData!: IListData[];
  @Prop({ default: true })
  public globalClickClose!: boolean;
  @Prop({ default: '待选择' })
  public placeholder!: string;

  @Prop() public defaultValue?: string | number | null;
  @Prop() public updateValue?: (value: string | number | null) => void;

  public value: string | number = this.defaultValue || this.placeholder;
  public listVisible: boolean = false;

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



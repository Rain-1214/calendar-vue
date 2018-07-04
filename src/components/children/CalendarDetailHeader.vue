<template>
  <div className="calendar-header">
    <div>
      <Dropdown :value="currentYear" :listData="yearList" :maxHeight="200" />  
    </div>
    <div>
      <div className="icon prev" />
      
      <div className="icon next" />
    </div>
    <div>
      <button className="btn">返回今日</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IListData } from '@/index.type';
import Dropdown from '@/components/common/Dropdown.vue';
import LunarCalendarDataService from '@/tool/LunarCalendar';

@Component({
  components: {
    Dropdown,
  },
})
export default class CalendarDetailHeader extends Vue {

  @Prop({ required: true }) public year!: number;
  @Prop({ required: true }) public month!: number;

  public currentYear: number = this.year;
  public currentMonth: number = this.month;
  public lunarCalendarDataService: LunarCalendarDataService = LunarCalendarDataService.getInstance();

  private yearList: IListData[] = [];
  private monthList: IListData[] = [];

  public created() {
    const { startYear, endYear } = this.lunarCalendarDataService.getScopeOfLunarYear();
    for (let i = startYear; i <= endYear; i++) {
      this.yearList.push({
        label: `${i}年`,
        value: i,
      });
    }
    for (let y = 1; y <= 12; y++) {
      this.monthList.push({
        label: `${y}月`,
        value: y,
      });
    }
  }

}

</script>
<style lang="scss" scoped>
@import 'src/assets/sass/_variable.scss';

.calendar-header {
  >div{
    margin-right: 10px;
    display: flex;
  }
  .icon{
    box-sizing: border-box;
    width: 22px;
    height: 26px;
    border: 1px solid $border-color-gray-dark;
    position: relative;
    cursor: pointer;
    &:hover{
      background: $border-color-gray-dark;
      &::after{
        border-color: $border-color-white;
      }
    }
    &.prev{
      border-right: none;
      &::after{
        transform: translate(-2.5px, -4.5px) rotateZ(45deg);
      }
    }
    &.next{
      border-left: none;
      &::after{
        transform: translate(-7.5px, -4.5px) rotateZ(-135deg);
      }
    }
    &::after{
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-left: 1px solid $border-color-gray-dark;
      border-bottom: 1px solid $border-color-gray-dark;
    }
  }
}



.btn{
  box-sizing: border-box;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background: $bg-color-gray;
  outline: none;
  border: none;
  padding: 0 10px;
  border: 1px solid $border-color-gray;
  cursor: pointer;
  &:active{
    box-shadow: inset 1px 1px 1px $border-color-gray-dark;
  }
  &:hover{
    border-color: $border-color-blue;
  }
}


</style>


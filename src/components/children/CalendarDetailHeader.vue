<template>
  <div class="calendar-header">
    <div>
      <Dropdown :value="currentYear" :listData="yearList" :maxHeight="200" @updateValue="receiveDate('year', $event)" />
    </div>
    <div>
      <div class="icon prev" />
      <Dropdown :value="currentMonth" :listData="monthList" :maxHeight="200" @updateValue="receiveDate('month', $event)"/>
      <div class="icon next" />
    </div>
    <div>
      <button class="btn" @click="returnToday">返回今日</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import { IListData, ISelectDate } from '@/index.type';
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

  public receiveDate(selectType: 'year' | 'month', selectValue: number) {
    switch (selectType) {
      case 'year':
        this.currentYear = selectValue;
        this.updateDate({ year: this.currentYear, month: this.currentMonth });
        break;
      case 'month':
        this.currentMonth = selectValue;
        this.updateDate({ year: this.currentYear, month: this.currentMonth });
        break;
    }
  }

  @Watch('year')
  public watchYear() {
    if (this.year !== this.currentYear) {
      this.currentYear = this.year;
    }
  }

  @Watch('month')
  public watchMonth() {
    if (this.month !== this.currentMonth) {
      this.currentMonth = this.month;
    }
  }

  @Emit('updateDate')
  public updateDate(selectDate: ISelectDate) {}
  @Emit('returnToday')
  public returnToday() {}

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


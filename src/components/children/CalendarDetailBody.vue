<template>
  <div class="body-wrapper">
    <table>
      <tbody>
        <tr>
          <th>一</th>
          <th>二</th>
          <th>三</th>
          <th>四</th>
          <th>五</th>
          <th class="isWeekend">六</th>
          <th class="isWeekend">日</th>
        </tr>
        <tr v-for="(e, i) in tableData" :key="i">
          <td v-for="(item, index) in e" :key="index" @click="selectDate(item)">
            <div class="day-wrapper"
              :class="{
                'active': item.year === currentYear && item.month === currentMonth && item.day === currentDay,
                'day-wrapper': true,
                'isNotInCurrentMonth': item.isNotInCurrentMonth,
                'isWeekend': item.isWeekend,
                'today': item.year === new Date().getFullYear() && item.month === new Date().getMonth() + 1 && item.day === new Date().getDate(),
              }">
              <span class="number">
                {{ item.day }}
              </span>
              <span class="lunar-text">
                {{ item.lunarDayStr }}
              </span>
              <div class="schedule-icon" v-if="showSchedule">
                <i v-if="item.hasSchedule" :style="{
                  backgroundColor: scheduleIconColor
                }"/>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator';
import { IScheduleList, IDateTableData, ISelectDate } from '@/index.type';
import LunarCalendarDataService from '@/tool/LunarCalendar';

@Component
export default class CalendarDetailBody extends Vue {

  @Prop({ required: true }) public year!: number;
  @Prop({ required: true }) public month!: number;
  @Prop({ required: true }) public day!: number;
  @Prop({ required: true }) public scheduleIconColor!: string;
  @Prop({ default: true }) public showSchedule!: boolean;
  @Prop() public schedules?: IScheduleList[];

  public lunarData: LunarCalendarDataService = LunarCalendarDataService.getInstance();
  public tableData: IDateTableData[][] = [];
  public currentYear: number = this.year;
  public currentMonth: number = this.month;
  public currentDay: number = this.day;

  public created() {
    this.createTableData(this.currentYear, this.currentMonth);
  }

  public createTableData(year: number, month: number) {
    const tableData: IDateTableData[][] = [];

    const prevMonthLastDayDate = new Date(year, month - 1, 0);
    const currentMonthLastDayDate = new Date(year, month, 0);
    const nextMonthFirstDayDate = new Date(year, month, 1);
    const tableTdSum = prevMonthLastDayDate.getDay() + currentMonthLastDayDate.getDate();
    const tableTrs = Math.ceil(tableTdSum / 7);
    let lunarData = this.lunarData.getLunarMonthAndDay(year, month, 1);
    let lunarDay = lunarData.day;
    let day = 1;
    if (prevMonthLastDayDate.getDay() !== 0) {
      tableData.push(this.addPrevMonthTableData(prevMonthLastDayDate));
    }
    for (let i = 0; i < tableTrs; i++) {
      if (!tableData[i]) {
        tableData[i] = [];
      }
      const currentTr = tableData[i];
      for (let j = currentTr.length; currentTr.length < 7; j++) {
        currentTr.push({
          day,
          hasSchedule: this.checkHasSchedule(year, month , day),
          isNotInCurrentMonth: false,
          isWeekend: j >= 5,
          lunarDay,
          lunarDayStr: this.lunarData.translateDayNumToCalendarStr(lunarDay),
          month,
          year,
        });
        day++;
        lunarDay++;
        if (lunarDay > lunarData.currentMonthDaysNum) {
          lunarData = this.lunarData.getLunarMonthAndDay(year, month, day);
          lunarDay = lunarData.day;
        }
        if (day > currentMonthLastDayDate.getDate()) {
          break;
        }
      }
    }
    if (tableData[tableData.length - 1].length < 7) {
      this.addNextMonthTableData(nextMonthFirstDayDate, tableData[tableData.length - 1]);
    }
    this.tableData = tableData;
  }

  public addPrevMonthTableData(prevMonthLastDayDate: Date): IDateTableData[] {
    const tempArray: IDateTableData[] = [];
    const [ year, month ] = [ prevMonthLastDayDate.getFullYear(), prevMonthLastDayDate.getMonth() + 1 ];
    let day = prevMonthLastDayDate.getDate();
    const lunarData = this.lunarData.getLunarMonthAndDay(year, month, day);
    let lunarDay = lunarData.day;
    let week = prevMonthLastDayDate.getDay() === 0 ? 7 : prevMonthLastDayDate.getDay();
    for (let i = week; i > 0; i--) {
      tempArray.unshift({
        day,
        hasSchedule: this.checkHasSchedule(year, month, day),
        isNotInCurrentMonth: true,
        isWeekend: week-- >= 6,
        lunarDay,
        lunarDayStr: this.lunarData.translateDayNumToCalendarStr(lunarDay),
        month,
        year,
      });
      day--;
      lunarDay--;
      if (lunarDay <= 0) {
        lunarDay = this.lunarData.getLunarMonthAndDay(year, month, day).day;
      }
    }
    return tempArray;
  }

  public addNextMonthTableData(nextMonthFirstDayDate: Date, lastTrData: IDateTableData[]) {
    const [ year, month ] = [ nextMonthFirstDayDate.getFullYear(), nextMonthFirstDayDate.getMonth() + 1 ];
    let day = 1;
    const lunarData = this.lunarData.getLunarMonthAndDay(year, month, 1);
    let lunarDay = lunarData.day;
    let week = this.getDateWeek(nextMonthFirstDayDate);
    for (let i = lastTrData.length; i < 7; i++) {
      lastTrData.push({
        day,
        hasSchedule: this.checkHasSchedule(year, month, day),
        isNotInCurrentMonth: true,
        isWeekend: week++ >= 6,
        lunarDay,
        lunarDayStr: this.lunarData.translateDayNumToCalendarStr(lunarDay),
        month,
        year,
      });
      day++;
      lunarDay++;
      if (lunarDay > lunarData.currentMonthDaysNum) {
        lunarDay = 1;
      }
    }
  }

  public checkHasSchedule(year: number, month: number, day: number): boolean {
    if (!this.schedules) {
      return false;
    }
    return !!this.schedules.find((e) => e.year === year && e.month === month && e.day === day);
  }

  public selectDate(data: IDateTableData) {
    const { startYear, endYear } = this.lunarData.getScopeOfLunarYear();
    if (data.year < startYear || data.year > endYear) {
      return;
    }
    this.updateDate({ year: data.year, month: data.month, day: data.day });
  }

  @Emit('updateDate')
  public updateDate(selectDate: ISelectDate) {}

  @Watch('year')
  public watchYear(value: number) {
    if (this.year !== this.currentYear) {
      this.currentYear = this.year;
      this.createTableData(this.currentYear, this.currentMonth);
    }
  }

  @Watch('month')
  public watchMonth() {
    if (this.month !== this.currentMonth) {
      this.currentMonth = this.month;
      this.createTableData(this.currentYear, this.currentMonth);
    }
  }

  @Watch('day')
  public watchDay() {
    if (this.day !== this.currentDay) {
      this.currentDay = this.day;
    }
  }

  @Watch('schedules')
  @Watch('showSchedule')
  public reRenderTable() {
    this.createTableData(this.currentYear, this.currentMonth);
  }

  private getDateWeek(date: Date) {
    const week = date.getDay();
    return week === 0 ? 7 : week;
  }

}

</script>
<style lang="scss" scoped>
@import 'src/assets/sass/_variable.scss';

table{
  width: 100%;
  border-spacing: 0;
  .text-red{
    color: $text-color-red;
  }
  tr{
    th{
      font-weight: normal;
      padding: 6px 0 3px;
      &.isWeekend{
        color: $text-color-red;
      }
    }
    td{
      border-top: 1px solid $border-color-gray-dark;
      text-align: center;
      margin: 0;
      .day-wrapper{
        box-sizing: border-box;
        padding: 6px 3px;
        display: block;
        border: 3px solid transparent;
        cursor: pointer;
        &.isNotInCurrentMonth{
          color: $text-color-gray-dark !important;
          .lunar-text{
            color: $text-color-gray-dark !important;
          }
          .schedule-icon{
            i{
              background: $text-color-gray-dark !important;
            }
          }
        }
        &.active{
          border-color: $border-color-orange;
        }
        &.isWeekend{
          color: $text-color-red;
        }
        &.today{
          background: $bg-color-orange;
          color: $text-color-white;
          span{
            color: $text-color-white;
          }
        }
        &:hover{
          border-color: $border-color-orange;
        }
        span{
          display: block;
        }
        .number{
          font-size: 18px;
        }
        .lunar-text{
          color: $text-color-gray-darken;
          font-size: 12px;
        }
        .schedule-icon{
          height: 5px;
          margin-top: 3px;
          i{
            display: block;
            width: 5px;
            height: 5px;
            margin: 0 auto;
          }
        }
      }
    }
  }
}
</style>


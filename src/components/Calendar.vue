<template>
  <div class="calendar-wrapper" :style="{ width: width + 'px' }">
    <div class="calendar-detail-wrapper">
      <div class="header">
        <CalendarDetailHeader :year="year" :month="month" @returnToday="returnToday" @updateDate="receiveDate($event)" />
      </div>
      <div class="body">
        calendar-body
      </div>
    </div>
    <div class="schedule-wrapper">
      schedule
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { ISelectDate, IScheduleList } from '../index.type';
import CalendarDetailHeader from './children/CalendarDetailHeader.vue';

@Component({
  components: {
    CalendarDetailHeader,
  },
})
export default class Calendar extends Vue {

  @Prop({ default: new Date().getFullYear() }) public defaultYear!: number;
  @Prop({ default: new Date().getMonth() }) public defaultMonth!: number;
  @Prop({ default: new Date().getDate() }) public defaultDay!: number;
  @Prop({ default: () => [] }) public schedule!: IScheduleList[];
  @Prop({ default: '#f60'}) public scheduleIconColor!: string;
  @Prop({ default: false }) public showSchedule!: boolean;
  @Prop({ default: true }) public showToday!: boolean;
  @Prop({ default: 550 }) public width!: number;

  public year!: number;
  public month!: number;
  public day!: number;

  public created() {
    this.year = this.defaultYear;
    this.month = this.defaultMonth;
    this.day = this.defaultDay;
  }

  public returnToday() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.day = today.getDate();
  }

  public receiveDate(selectDate: ISelectDate) {
    // tslint:disable-next-line:no-console
    console.log(selectDate);
    switch (true) {
      case !!selectDate.day:
        this.day = selectDate.day as number;
      default:
        this.year = selectDate.year;
        this.month = selectDate.month;
    }
  }

  @Emit('receiveDate')
  public updateDate(selectDate: ISelectDate) {}

}
</script>
<style lang="scss" scoped>
@import 'src/assets/sass/_variable.scss';

.calendar-wrapper {
  border: 2px solid $border-color-blue-light;
  display: flex;
  position: relative;
  .calendar-detail-wrapper{
    margin-right: 30%;
    width: 70%;
    padding: 10px;
    .header{
      display: flex;
      padding-bottom: 10px;
      border-bottom: 1px solid $border-color-blue;
      >div{
        margin-right: 10px;
        display: flex;
      }
    }
  }
  .schedule-wrapper {
    width: 30%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>



<template>
  <div class="calendar-wrapper" :style="{ width: width + 'px' }">
    <div class="calendar-detail-wrapper">
      <div class="header">
        <CalendarDetailHeader :year="currentYear" :month="currentMonth" @returnToday="returnToday" @updateDate="receiveDate($event)" />
      </div>
      <div class="body">
        <CalendarDetailBody :year="currentYear" :month="currentMonth" :day="currentDay" :scheduleIconColor="scheduleIconColor" 
                            :schedules="tempSchedule" @updateDate="receiveDate($event)" />
      </div>
    </div>
    <div class="schedule-wrapper">
      <Schedule :year="currentYear" :month="currentMonth" :day="currentDay" :schedule="tempSchedule" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { ISelectDate, IScheduleList } from '../index.type';
import CalendarDetailHeader from './children/CalendarDetailHeader.vue';
import CalendarDetailBody from './children/CalendarDetailBody.vue';
import Schedule from './children/Schedule.vue';

@Component({
  components: {
    CalendarDetailHeader,
    CalendarDetailBody,
    Schedule,
  },
})
export default class Calendar extends Vue {

  @Prop({ default: new Date().getFullYear() }) public year!: number;
  @Prop({ default: new Date().getMonth() + 1 }) public month!: number;
  @Prop({ default: new Date().getDate() }) public day!: number;
  @Prop({ default: () => [] }) public schedule!: IScheduleList[];
  @Prop({ default: '#f60'}) public scheduleIconColor!: string;
  @Prop({ default: false }) public showSchedule!: boolean;
  @Prop({ default: true }) public showToday!: boolean;
  @Prop({ default: 550 }) public width!: number;

  public currentYear: number = this.year;
  public currentMonth: number = this.month;
  public currentDay: number = this.day;
  public tempSchedule: IScheduleList[] = [];

  public created() {
    this.currentYear = this.year;
    this.currentMonth = this.month;
    this.currentDay = this.day;
    this.tempSchedule = [
      {
        day: 22,
        month: 7,
        schedules: [
          {
            description: '吃饭',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
        ],
        year: 2018,
      },
      {
        day: 12,
        month: 7,
        schedules: [
          {
            description: '吃饭1',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉1',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
        ],
        year: 2018,
      },
      {
        day: 5,
        month: 7,
        schedules: [
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '吃饭2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
          {
            description: '睡觉2',
            endTime: '10:00',
            iconColor: '#ff0000',
            startTime: '9:00',
          },
        ],
        year: 2018,
      },
    ];
  }

  public returnToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
    this.currentDay = today.getDate();
    this.updateDate({ year: this.currentYear, month: this.currentMonth, day: this.currentDay });
  }

  public receiveDate(selectDate: ISelectDate) {
    switch (true) {
      case !!selectDate.day:
        this.currentDay = selectDate.day as number;
      default:
        this.currentYear = selectDate.year;
        this.currentMonth = selectDate.month;
    }
    this.updateDate({ year: this.currentYear, month: this.currentMonth, day: this.currentDay });
  }

  @Emit('receiveDate')
  public updateDate(selectDate: ISelectDate) {}

  @Watch('year')
  public watchYear() {
    this.currentYear = this.year;
  }

  @Watch('month')
  public watchMonth() {
    this.currentMonth = this.month;
  }

  @Watch('day')
  public watchDay() {
    this.currentDay = this.day;
  }

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



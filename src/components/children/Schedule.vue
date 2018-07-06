<template>
  <div class="schedule">
    <div class="header">
      <div>
        {{ currentDate.getFullYear() }}-{{ currentDate.getMonth() + 1 }}-{{ currentDate.getDate() }} 星期{{ chineseWeek[currentDate.getDay()] }}
      </div>
      <div class="day">
        {{ currentDate.getDate() }}
      </div>
      <div>
        {{ lunarData.chineseEra.era }}年 {{ lunarData.chineseEra.chineseZodiacAnimal }}年
      </div>
      <div>
        {{ lunarData.isLeapMonth ? '闰' : '' }}{{ `${lunarData.monthStr}${lunarData.dayStr}` }}
      </div>
    </div>
    <div class="list">
      <div class="title">
        今日日程
      </div>
      <ul>
        <template v-if="currentSchedule.length != 0">
          <li v-for="(e, i) in currentSchedule" :key="i">
            <div class="time">
              <i class="icon" :style="{ backgroundColor: e.iconColor }" /> {{`${e.startTime} - ${e.endTime}`}}
            </div>
            <div class="description">
              {{e.description}}
            </div>
          </li>
        </template>
        <template v-else>
          <li class="empty">暂无日程</li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { IScheduleList, IChineseEra, ILunarData, ISchedule } from '@/index.type';
import LunarCalendarDataService from '@/tool/LunarCalendar';

@Component
export default class Schedule extends Vue {

  @Prop({ required: true }) public year!: number;
  @Prop({ required: true }) public month!: number;
  @Prop({ required: true }) public day!: number;
  @Prop({ default: () => [] }) public schedule?: IScheduleList[];

  public lunarDataService: LunarCalendarDataService = LunarCalendarDataService.getInstance();
  public currentDate = new Date(this.year, this.month - 1, this.day);
  public lunarData: ILunarData = this.lunarDataService.getLunarMonthAndDay(this.year, this.month, this.day);
  public chineseWeek = ['日', '一', '二', '三', '四', '五', '六'];
  public currentSchedule: ISchedule[] = [];

  public created() {
    this.initSchedule();
  }

  public initSchedule() {
    const currentScheduleList = (this.schedule as IScheduleList[]).find(
      (e) => e.year === this.year && e.month === this.month && e.day === this.day,
    );
    this.currentSchedule = currentScheduleList ? currentScheduleList.schedules : [];
    this.currentDate = new Date(this.year, this.month - 1, this.day);
    this.lunarData = this.lunarDataService.getLunarMonthAndDay(this.year, this.month, this.day);
  }

  @Watch('year')
  @Watch('month')
  @Watch('day')
  public dateChange() {
    this.initSchedule();
  }

}
</script>
<style lang="scss" scoped>
@import 'src/assets/sass/_variable.scss';

.schedule{
  box-sizing: border-box;
  height: 100%;
  border-left: 2px solid $border-color-blue-light;
  display: flex;
  flex-direction: column;
  .header{
    box-sizing: border-box;
    height: 101px;
    padding: 10px 5px;
    text-align: center;
    font-size: 12px;
    border-bottom: 2px solid $border-color-blue-light;
    .day{
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    }
  }
  .list{
    padding: 10px 5px;
    font-size: 12px;
    flex: 1 0 0;
    overflow-y: auto;
    li{
      margin-bottom: 5px;
      &.empty{
        color: $text-color-gray-dark;
        padding: 5px;
      }
    }
    .time{
      height: 16px;
      line-height: 16px;
      position: relative;
      padding-left: 10px;
      .icon{
        display: inline-block;
        width: 5px;
        height: 5px;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -2.5px;
      }
    }
    .description{
      padding-left: 10px;
    }
  }
  .text-center{
    text-align: center;
  }
}
</style>


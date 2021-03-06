import { IChineseEra, ILunarData } from '@/index.type';

// tslint:disable:no-bitwise

class LunarCalendarDataService {

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LunarCalendarDataService();
    }
    return this.instance;
  }

  private static instance: LunarCalendarDataService;

  public lunarMonthNumberToStrData: {[key: number]: string} = {
    1: '正月',
    2: '二月',
    3: '三月',
    4: '四月',
    5: '五月',
    6: '六月',
    7: '七月',
    8: '八月',
    9: '九月',
    10: '十月',
    11: '十一月',
    12: '腊月',
  };

  public lunarDayNumberToStrData: {[key: number]: string} = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九',
    10: '十',
    20: '廿',
    30: '三十',
  };

  public heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  public earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  public chineseZodiacAnimal = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];


  /**
   * 1、1899年-2051年 阴历每月天数和闰月信息;
   * 2、16进制数要将其转换成2进制 并在高位补0至17位，数据为了不使高位0丢失所以在最前一位补了无意义的1(一共18位)，删除后剩余17位如下;
   * 3、高四位若为0000标识当年没有闰月 否则为置闰月的月份数值 例: 0101 => 当年闰五月;
   * 4、低13位中 若当年有闰 则13位为每月天数 1 => 30天,0 => 29天, 例: 1 0111 0101 0000 => 1月30天 二月29天... [注1]
   *            若当年无闰 则13位中第一位为无意义0，剩余12位为每月天数 同上 👆
   *  注1： 若置闰，闰月数值月份有两个对应阴历月 如:
   *  0101 1011 1010 1000 0 : 0101 => 闰五月,1011 1010 1000 0 => 第一位->正月有30天 第二位->二月有29天....第五位->五月有30天 第六位->闰五月29天 第七位->六月30天...以此类推
   */
  private lunarCalendarData = [
                                0x20ab5, 0x3096d, 0x204ae, 0x20a57, 0x2aa4d, 0x20d26, 0x20d95, 0x28d55, 0x2056a, 0x209ad,
                                0x2495d, 0x204ae, 0x2d49b, 0x20a4d, 0x20d25, 0x2baa5, 0x20b54, 0x20d6a, 0x252da, 0x2095b,
                                0x2e937, 0x20497, 0x20a4b, 0x2b64b, 0x206a5, 0x206d4, 0x295b5, 0x202b6, 0x20957, 0x2492f,
                                0x20497, 0x2cc96, 0x20d4a, 0x20ea5, 0x2ada9, 0x205ad, 0x202b6, 0x2726e, 0x2092e, 0x2f92d,
                                0x20c95, 0x20d4a, 0x2db4a, 0x20b55, 0x2056a, 0x2955b, 0x2025d, 0x2092d, 0x2592b, 0x20a95,
                                0x2f695, 0x206ca, 0x20b55, 0x2aab5, 0x204da, 0x20a5b, 0x26a57, 0x2052b, 0x3152a, 0x20e95,
                                0x206aa, 0x2d5aa, 0x20ab5, 0x204b6, 0x294ae, 0x20a57, 0x20526, 0x27d26, 0x20d95, 0x2eb55,
                                0x2056a, 0x2096d, 0x2a95d, 0x204ad, 0x20a4d, 0x29a4d, 0x20d25, 0x31aa5, 0x20b54, 0x20b6a,
                                0x2d2da, 0x2095b, 0x2049b, 0x29497, 0x20a4b, 0x3564b, 0x206a5, 0x206d4, 0x2d5b4, 0x20ab6,
                                0x20957, 0x2a92f, 0x20497, 0x2064b, 0x26d4a, 0x20ea5, 0x30d65, 0x205ac, 0x20ab6, 0x2b26d,
                                0x2092e, 0x20c96, 0x29a95, 0x20d4a, 0x20da5, 0x24b55, 0x2056a, 0x2f55b, 0x2025d, 0x2092d,
                                0x2b92b, 0x20a95, 0x20b4a, 0x296aa, 0x20ad5, 0x32ab5, 0x204ba, 0x20a5b, 0x2ca57, 0x2052b,
                                0x20a93, 0x28e95, 0x206aa, 0x20ad5, 0x249b5, 0x204b6, 0x2d4ae, 0x20a4e, 0x20d26, 0x2bd26,
                                0x20d53, 0x205aa, 0x26d6a, 0x2096d, 0x3695d, 0x204ad, 0x20a4d, 0x2da4b, 0x20d25, 0x20d52,
                                0x2bb54, 0x20b5a, 0x2056d, 0x2495b, 0x2049b, 0x2f497, 0x20a4b, 0x20aa5, 0x2b6a5, 0x206d2,
                                0x20ada, 0x26ab6,
                              ];

  /**
   * 1899年2月10号 是正月初一
   */
  private fromLunarDateSecondes = new Date(1899, 1, 10).getTime();
  /**
   * 本地数据中存储的第一个年份
   */
  private firstDateYear = 1899;
  /**
   * 本地数据中存储的第一个年份的天干地支生肖数据
   */
  private firstDateYearEra: IChineseEra = {
    chineseZodiacAnimal: '猪',
    earthlyBranches: 11,
    era: '己亥',
    heavenlyStems: 5,
  };
  /**
   * 数据中可获取的安全起始年份
   */
  private safetyStartYear = 1900;
  /**
   * 数据中可获取的安全结束年份
   */
  private safetyEndYear = 2050;
  private dataCache: { [key: string]: ILunarData } = {}; // 数据缓存

  private constructor() {
  }

  /**
   * 获取一个阳历日期对应的阴历是几月几号 仅限1900到2050年之间
   * @param year 获取的阳历年份
   * @param month 获取的阳历月份
   * @param day 获取的阳历日号
   * @returns lunarData => {
   *    month: number; 阴历月份数值 => 1
   *    monthStr: string; 阴历月份翻译成汉字的月份字符串 => 一月
   *    day: number; 阴历日号数值 => 23
   *    dayStr: string; 阴历日号翻译成汉字的日号字符串 => 廿三
   *    currentMonthDaysNum: number; 当前阴历月份一共有多少天
   *    isLeapMonth: boolean; 当前月份是否是闰月
   *    isLeapYear: boolean; 当前阴历年是否是闰年
   *    chineseEra: {
   *        heavenlyStems: 天干，在天干数组中的下标
   *        earthlyBranches: 地支，在地支数组中的下标
   *        era: 天干和地支字符串
   *        chineseZodiacAnimal: 生肖年
   *   }
   * }
   */
  public getLunarMonthAndDay(year: number, month: number, day: number): ILunarData {
    if (this.dataCache[`${year}${month}${day}`]) {
      return this.dataCache[`${year}${month}${day}`];
    }
    if (year < 1899 || year > 2051 || year === 1899 && month < 12 || year === 2051 && month > 1) {
      throw new Error(`LunarCalendarData: getLunarMonthAndDay: 年份超出范围，当前年份${year}, 在${this.safetyStartYear}-${this.safetyEndYear}之间`);
    }
    const currentDate = new Date(year, month - 1, day);
    let betweenDays = (currentDate.getTime() - this.fromLunarDateSecondes) / 1000 / 60 / 60 / 24 + 1;
    betweenDays = Math.floor(betweenDays);
    let heavenlyStems = this.firstDateYearEra.heavenlyStems;
    let earthlyBranches = this.firstDateYearEra.earthlyBranches;
    let isLeapMonth = false;
    let isLeapYear = false;
    let lunarMonth = 0;
    let currentMonthDaysNum = 0;
    let lunarYear = this.firstDateYear;
    while (betweenDays >= 0) {
      const tempYearDays = this.getLunarYearDayNum(lunarYear);
      isLeapYear = this.getIsLeapYear(lunarYear);
      if (betweenDays > tempYearDays) {
        betweenDays -= tempYearDays;
        lunarYear++;
        earthlyBranches++;
        heavenlyStems++;
        if (earthlyBranches > 11) {
          earthlyBranches = 0;
        }
        if (heavenlyStems > 9) {
          heavenlyStems = 0;
        }
      } else if (betweenDays > 30) {
        for (let i = isLeapYear ? 12 : 11; i >= 0; i--) {
          const monthDayNum = ((this.lunarCalendarData[lunarYear - this.firstDateYear] & (1 << i)) >> i) === 1 ? 30 : 29;
          currentMonthDaysNum = monthDayNum;
          if (betweenDays <= monthDayNum) {
            break;
          }
          lunarMonth = (isLeapYear ? 13 : 12) - i + 1;
          betweenDays -= monthDayNum;
        }
      } else {
        lunarMonth = lunarMonth === 0 ? 1 : lunarMonth;
        if (isLeapYear) {
          const currentLeapMonthNum = this.getLeapMonthNum(lunarYear);
          if (lunarMonth === currentLeapMonthNum + 1) {
            isLeapMonth = true;
            lunarMonth--;
          } else if (lunarMonth > currentLeapMonthNum + 1) {
            lunarMonth--;
          }
        }
        break;
      }
    }
    const result: ILunarData = {
      chineseEra: {
        chineseZodiacAnimal: this.chineseZodiacAnimal[earthlyBranches],
        earthlyBranches,
        era: `${this.heavenlyStems[heavenlyStems]}${this.earthlyBranches[earthlyBranches]}`,
        heavenlyStems,
      },
      currentMonthDaysNum,
      day: betweenDays,
      dayStr: this.translateDayNumToCalendarStr(betweenDays),
      isLeapMonth,
      isLeapYear,
      month: lunarMonth,
      monthStr: this.lunarMonthNumberToStrData[lunarMonth],
    };
    this.dataCache[`${year}${month}${day}`] = result;
    return result;
  }

  /**
   * 获取一个阴历年当中是否有闰月
   * @param year 要获取的年份 仅仅支持1900-2050年
   */
  public getIsLeapYear(year: number): boolean {
    this.checkYearSafety(year);
    const currentYearData = this.lunarCalendarData[year - this.firstDateYear];
    return ((currentYearData & 0x1e000) >> 13) > 0;
  }

  /**
   * 获取一个阴历年份的全年天数
   * @param year 要获取的年份
   */
  public getLunarYearDayNum(year: number): number {
    this.checkYearSafety(year);
    const currentYearData = this.lunarCalendarData[year - this.firstDateYear];
    const isLeapYear = this.getIsLeapYear(year);
    let monthNum = isLeapYear ? 13 : 12;
    let JanBit =  isLeapYear ? 0x1000 : 0x800;
    let yearDayNum = 0;
    for (; monthNum > 0; monthNum--, JanBit >>= 1) {
      yearDayNum += (currentYearData & JanBit) === 0 ? 29 : 30;
    }
    return yearDayNum;
  }

  /**
   * 获取一个阴历闰年中闰月的月份值
   * @param year 要获取的年份
   */
  public getLeapMonthNum(year: number): number {
    this.checkYearSafety(year);
    if (this.getIsLeapYear(year)) {
      return (this.lunarCalendarData[year - this.firstDateYear] & 0x1e000) >> 13;
    } else {
      return -1;
    }
  }

  /**
   * 获取一个阴历月份的天数，如果要获取闰月需要指定 isLeapMonth
   * @param year 获取的年份
   * @param month 获取的月份(阴历)
   * @param isLeapMonth 要获取的月份是否是闰月
   */
  public getLunarMonthDays(year: number, month: number, isLeapMonth?: boolean): number {
    this.checkYearSafety(year);
    const currentYearData = this.lunarCalendarData[year - this.firstDateYear];
    let tempMonth = month;
    const isLeapYear = this.getIsLeapYear(year);
    if (isLeapYear) {
      const leapMonthNum = this.getLeapMonthNum(year);
      tempMonth = month > leapMonthNum ? tempMonth + 1 : tempMonth;
    }
    if (isLeapMonth) {
      if (month !== this.getLeapMonthNum(year)) {
        throw new Error(`LunarCalendarData: getLunarMonthDays: ${month}月不是当年闰月`);
      } else {
        tempMonth++;
      }
    }
    tempMonth = (isLeapYear ? 13 : 12) - tempMonth;
    return (currentYearData & (1 << tempMonth)) >> tempMonth === 1 ? 30 : 29;
  }

  /**
   * 将一个月份天数从数字翻译成阴历月份值
   * @param day {1->30} 要翻译的日期的日号
   */
  public translateDayNumToCalendarStr(day: number): string {
    if (day <= 0 || day > 30) {
      throw new Error('LunarCalendarData: translateDayNumToCalendarStr: 参数day必须是大于0小于31,当前day: ' + day);
    }
    switch (true) {
      case (day <= 10):
        return '初' + this.lunarDayNumberToStrData[day];
      case (day < 20):
        return `${this.lunarDayNumberToStrData[10]}${this.lunarDayNumberToStrData[day % 10]}`;
      case (day === 20):
        return `${this.lunarDayNumberToStrData[2]}${this.lunarDayNumberToStrData[10]}`;
      case (day < 30):
        return `${this.lunarDayNumberToStrData[20]}${this.lunarDayNumberToStrData[day % 10]}`;
      case (day === 30):
        return this.lunarDayNumberToStrData[30];
      default :
        return '';
    }
  }

  /**
   * 获取支持的年份范围
   * @returns {Object} {
   *  startYear: 开始年份,
   *  endYear: 结束年份
   * }
   */
  public getScopeOfLunarYear(): { startYear: number, endYear: number } {
    return {
      endYear: this.safetyEndYear,
      startYear: this.safetyStartYear,
    };
  }

  /**
   * 检测一个年份是否在安全范围内
   * @param year 检测的年份
   */
  private checkYearSafety(year: number) {
    if (year < this.safetyStartYear - 1 || year > this.safetyEndYear + 1) {
      throw new Error(`year必须在${this.safetyStartYear}-${this.safetyEndYear}之间`);
    }
  }
}

export default LunarCalendarDataService;

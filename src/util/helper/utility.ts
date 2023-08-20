export default class UtilityClass {
  public static isTime1InFutureWrtTime2StringFormat(
    startTime: string,
    endTime: string,
  ): boolean {
    const time1Parsed = new Date(startTime);
    const time2Parsed = new Date(endTime);
    return time1Parsed > time2Parsed;
  }
  public static isTime1InFutureWrtTime2DateFormat(
    startTime: Date,
    endTime: Date,
  ): boolean {
    return startTime > endTime;
  }
}

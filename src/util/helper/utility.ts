export default class UtilityClass {
  public static isTime2InFutureWrtTime1StringFormat(
    startTime: string,
    endTime: string,
  ): boolean {
    const time1Parsed = new Date(startTime);
    const time2Parsed = new Date(endTime);
    return time1Parsed < time2Parsed;
  }
  public static isTime2InFutureWrtTime1DateFormat(
    startTime: Date,
    endTime: Date,
  ): boolean {
    return startTime < endTime;
  }
}

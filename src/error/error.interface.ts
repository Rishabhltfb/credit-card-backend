export class CustomError {
  private readonly errorCode: string;
  private readonly message: string;
  private readonly errorStatus: string;
  private readonly _isError: boolean = true;

  constructor(errorCode?: string, errorStatus?: string, message?: string) {
    this.errorCode = errorCode;
    this.message = message;
    this.errorStatus = errorStatus;
  }
  public getErrorCode() {
    return this.errorCode;
  }
  public getMessage() {
    return this.message;
  }
  public getStatus() {
    return this.errorStatus;
  }
}

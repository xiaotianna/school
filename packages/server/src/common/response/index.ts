export class ResponseData<T> {
  constructor(
    public code: number,
    public message: string,
    public data: T,
  ) {}

  static success<T = any>(data: T) {
    return new ResponseData(200, 'success', data);
  }

  static error(code: number, message: string) {
    return new ResponseData(code, message, null);
  }
}

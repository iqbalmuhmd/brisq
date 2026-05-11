export class ApiResponse {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: unknown;

  constructor(success: boolean, message: string, data?: unknown) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

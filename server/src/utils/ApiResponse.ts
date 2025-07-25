class ApiResponse {
  statusCode: number;
  success: boolean;
  name: string;
  message: string;
  data: any;
  constructor(statusCode = 200, message = "SUCCESS", data = null) {
    this.name = "Api Response";
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };

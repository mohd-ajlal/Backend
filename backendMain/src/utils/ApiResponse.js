class ApiResponse {
  constructor(statusCode, data, message  = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = sussessCode<400;

  }
}

export {ApiResponse};
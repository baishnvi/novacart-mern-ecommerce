class ApiResponse {
  constructor(statusCode, data = null, message = "Success", meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

const sendSuccess = (res, statusCode, message, data = null, meta = null) => {
  return new ApiResponse(statusCode, data, message, meta).send(res);
};

module.exports = { ApiResponse, sendSuccess };

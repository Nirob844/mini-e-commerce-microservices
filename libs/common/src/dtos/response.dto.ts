export class ResponseDto<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    data?: T,
    success: boolean = true,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginatedResponseDto<T> extends ResponseDto<T[]> {
  totalCount: number;
  page: number;
  pageSize: number;

  constructor(data: T[], totalCount: number, page: number, pageSize: number) {
    super(200, 'Success', data);
    this.totalCount = totalCount;
    this.page = page;
    this.pageSize = pageSize;
  }
}

// Comprehensive error handling system for GRC Atlas

export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  code: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  requestId?: string;
}

export class GRCError extends Error {
  public readonly type: ErrorType;
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    type: ErrorType,
    message: string,
    code: string,
    statusCode: number,
    details?: any,
    requestId?: string
  ) {
    super(message);
    this.name = 'GRCError';
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
  }
}

// Error factory functions
export const ErrorFactory = {
  validation: (message: string, details?: any, requestId?: string): GRCError => 
    new GRCError(ErrorType.VALIDATION_ERROR, message, 'VALIDATION_FAILED', 400, details, requestId),

  authentication: (message: string = 'Authentication required', requestId?: string): GRCError =>
    new GRCError(ErrorType.AUTHENTICATION_ERROR, message, 'AUTH_REQUIRED', 401, undefined, requestId),

  authorization: (message: string = 'Insufficient permissions', requestId?: string): GRCError =>
    new GRCError(ErrorType.AUTHORIZATION_ERROR, message, 'INSUFFICIENT_PERMISSIONS', 403, undefined, requestId),

  notFound: (resource: string, requestId?: string): GRCError =>
    new GRCError(ErrorType.NOT_FOUND_ERROR, `${resource} not found`, 'RESOURCE_NOT_FOUND', 404, undefined, requestId),

  rateLimit: (message: string = 'Rate limit exceeded', requestId?: string): GRCError =>
    new GRCError(ErrorType.RATE_LIMIT_ERROR, message, 'RATE_LIMIT_EXCEEDED', 429, undefined, requestId),

  database: (message: string, details?: any, requestId?: string): GRCError =>
    new GRCError(ErrorType.DATABASE_ERROR, message, 'DATABASE_ERROR', 500, details, requestId),

  externalApi: (service: string, message: string, details?: any, requestId?: string): GRCError =>
    new GRCError(ErrorType.EXTERNAL_API_ERROR, `${service}: ${message}`, 'EXTERNAL_API_ERROR', 502, details, requestId),

  internal: (message: string = 'Internal server error', details?: any, requestId?: string): GRCError =>
    new GRCError(ErrorType.INTERNAL_SERVER_ERROR, message, 'INTERNAL_ERROR', 500, details, requestId),

  businessLogic: (message: string, details?: any, requestId?: string): GRCError =>
    new GRCError(ErrorType.BUSINESS_LOGIC_ERROR, message, 'BUSINESS_LOGIC_ERROR', 422, details, requestId)
};

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle and log errors
  public handleError(error: Error | GRCError, requestId?: string): AppError {
    let appError: AppError;

    if (error instanceof GRCError) {
      appError = {
        type: error.type,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        timestamp: error.timestamp,
        requestId: error.requestId || requestId
      };
    } else {
      // Convert generic errors to AppError
      appError = {
        type: ErrorType.INTERNAL_SERVER_ERROR,
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        statusCode: 500,
        details: { originalError: error.name },
        timestamp: new Date().toISOString(),
        requestId
      };
    }

    // Log error
    this.logError(appError);

    return appError;
  }

  // Log error to internal store (in production, use proper logging service)
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Keep only last 1000 errors
    if (this.errorLog.length > 1000) {
      this.errorLog = this.errorLog.slice(-1000);
    }

    // In production, send to logging service
    console.error('GRC Error:', {
      type: error.type,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      requestId: error.requestId,
      details: error.details
    });
  }

  // Get error statistics
  public getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    byStatusCode: Record<number, number>;
    recent: AppError[];
  } {
    const byType: Record<ErrorType, number> = {} as Record<ErrorType, number>;
    const byStatusCode: Record<number, number> = {};

    // Initialize counters
    Object.values(ErrorType).forEach(type => {
      byType[type] = 0;
    });

    // Count errors
    this.errorLog.forEach(error => {
      byType[error.type]++;
      byStatusCode[error.statusCode] = (byStatusCode[error.statusCode] || 0) + 1;
    });

    return {
      total: this.errorLog.length,
      byType,
      byStatusCode,
      recent: this.errorLog.slice(-10)
    };
  }

  // Clear error log
  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance();

// Error response formatter
export function formatErrorResponse(error: AppError): {
  error: {
    type: string;
    message: string;
    code: string;
    timestamp: string;
    requestId?: string;
    details?: any;
  };
  statusCode: number;
} {
  return {
    error: {
      type: error.type,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      requestId: error.requestId,
      details: error.details
    },
    statusCode: error.statusCode
  };
}

// Async error wrapper for API routes
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = errorHandler.handleError(error as Error);
      throw appError;
    }
  };
}

// Validation error formatter
export function formatValidationErrors(errors: string[]): GRCError {
  return ErrorFactory.validation(
    'Validation failed',
    { errors },
    undefined
  );
}

// Database error formatter
export function formatDatabaseError(error: any, operation: string): GRCError {
  return ErrorFactory.database(
    `Database ${operation} failed`,
    { originalError: error.message },
    undefined
  );
}

// Export error handling utilities
export const ErrorUtils = {
  ErrorFactory,
  ErrorHandler,
  errorHandler,
  formatErrorResponse,
  asyncHandler,
  formatValidationErrors,
  formatDatabaseError
};

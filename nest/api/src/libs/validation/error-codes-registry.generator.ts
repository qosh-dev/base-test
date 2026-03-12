import {
  BadRequestErrorCode,
  ConflictErrorCode,
  errorCategoryDescriptions,
  errorSpecificDescriptions,
  ForbiddenErrorCode,
  InternalServerErrorCode,
  NotFoundErrorCode,
  TooManyRequestsErrorCode,
  UnauthorizedErrorCode,
  UnprocessableEntityErrorCode
} from "./error-codes.const";

type ErrorCodeEntry = {
  code: number;
  name: string;
  description: string;
};

type ErrorCodeGroup = {
  statusCode: number;
  statusName: string;
  errorCodes: ErrorCodeEntry[];
};

export class ErrorCodesRegistryGenerator {
  private static generateDescription(code: number, name: string): string {
    const statusCode = Math.floor(code / 1000);
    const baseDescription = errorCategoryDescriptions[statusCode] || "Ошибка";

    return errorSpecificDescriptions[code] || `${baseDescription}: ${name}`;
  }

  private static extractErrorCodes(
    errorEnum: Record<string, string | number>
  ): ErrorCodeEntry[] {
    return Object.keys(errorEnum)
      .filter((key) => !Number.isNaN(Number(key)))
      .map((key) => {
        const code = Number(key);
        const name = String(errorEnum[code]);

        return {
          code,
          name,
          description: this.generateDescription(code, name)
        };
      });
  }

  static generateRegistry(): {
    errorCodes: ErrorCodeGroup[];
    totalCodes: number;
    lastUpdated: string;
  } {
    const errorEnumsConfig: Array<{
      statusCode: number;
      statusName: string;
      errorEnum: Record<string, string | number>;
    }> = [
      {
        statusCode: 400,
        statusName: "Bad Request",
        errorEnum: BadRequestErrorCode
      },
      {
        statusCode: 401,
        statusName: "Unauthorized",
        errorEnum: UnauthorizedErrorCode
      },
      {
        statusCode: 403,
        statusName: "Forbidden",
        errorEnum: ForbiddenErrorCode
      },
      {
        statusCode: 404,
        statusName: "Not Found",
        errorEnum: NotFoundErrorCode
      },
      { statusCode: 409, statusName: "Conflict", errorEnum: ConflictErrorCode },
      {
        statusCode: 422,
        statusName: "Unprocessable Entity",
        errorEnum: UnprocessableEntityErrorCode
      },
      {
        statusCode: 429,
        statusName: "Too Many Requests",
        errorEnum: TooManyRequestsErrorCode
      },
      {
        statusCode: 500,
        statusName: "Internal Server Error",
        errorEnum: InternalServerErrorCode
      }
    ];

    const errorCodes = errorEnumsConfig.map(
      ({ statusCode, statusName, errorEnum }) => ({
        statusCode,
        statusName,
        errorCodes: this.extractErrorCodes(errorEnum)
      })
    );

    const totalCodes = errorCodes.reduce(
      (sum, group) => sum + group.errorCodes.length,
      0
    );

    return {
      errorCodes,
      totalCodes,
      lastUpdated: new Date().toISOString()
    };
  }
}

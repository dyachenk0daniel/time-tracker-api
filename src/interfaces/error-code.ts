export enum ErrorCode {
    BadRequest = 'BAD_REQUEST',
    UserNotFound = 'USER_NOT_FOUND',
    InvalidPassword = 'INVALID_PASSWORD',
    FieldsMissing = 'FIELDS_MISSING',
    UserAlreadyExists = 'USER_ALREADY_EXISTS',
    ServerError = 'SERVER_ERROR',
    AuthorizationHeaderMissing = 'AUTHORIZATION_HEADER_MISSING',
    InvalidOrExpiredToken = 'INVALID_OR_EXPIRED_TOKEN',
}
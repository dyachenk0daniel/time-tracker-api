export enum ErrorCode {
    BadRequest = 'BAD_REQUEST',
    UserNotFound = 'USER_NOT_FOUND',
    InvalidPassword = 'INVALID_PASSWORD',
    UserAlreadyExists = 'USER_ALREADY_EXISTS',
    InternalServerError = 'INTERNAL_SERVER_ERROR',
    AuthorizationHeaderMissing = 'AUTHORIZATION_HEADER_MISSING',
    InvalidOrExpiredToken = 'INVALID_OR_EXPIRED_TOKEN',
    TimeEntryNotFound = 'TIME_ENTRY_NOT_FOUND',
}
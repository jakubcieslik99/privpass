export const SERVER_ERROR = '500_1: Server error.'
export const UNAUTHORIZED = '401_1: Authorization error.'
export const SESSION_EXPIRED = '403_1: Authorization error, session has expired.'
export const RESOURCE_DOES_NOT_EXIST = '404_1: Resource does not exist.'
export const USER_DOES_NOT_EXIST = '404_2: User does not exist or has been deleted.'
export const PASSWORD_DOES_NOT_EXIST = '404_3: Password does not exist or has been deleted.'
export const INVALID_ACCESS_CODE = '406_1: Invalid access code.'
export const ACCESS_CODE_EXPIRED = '406_2: Access code expired.'
export const USER_ALREADY_LOGGED_IN = '409_1: User is already logged in.'
export const USER_EMAIL_ALREADY_EXISTS = '409_2: User with given email already exists.'
export const PASSWORD_NAME_ALREADY_EXISTS = '409_3: Password with given name already exists.'
export const UNPROCESSABLE_ENTITY = '422_1: Wrong data has been sent.'
export const TOO_MANY_REQUESTS = '429_1: Too many requests.'
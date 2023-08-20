export class ERROR_STATUS_CONSTANTS {
  static VALIDATION_FAILED = 'VALIDATION_FAILED';
  static CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND';
  static LESS_ACCOUNT_LIMIT = 'LESS_ACCOUNT_LIMIT';
  static LESS_PER_TRANSACTION_LIMIT = 'LESS_PER_TRANSACTION_LIMIT';
  static INVALID_OFFER_STATUS = 'INVALID_OFFER_STATUS';
  static EXPIRY_TIME_ERROR = 'EXPIRY_TIME_ERROR';
}
export class ERROR_MSG_CONSTANTS {
  static ACCOUNT_CREATION_FAILED = 'Account creation checks failed!';
  static EXPIRY_TIME_ERROR_MSG =
    'Offer expiry time is not greater than offer activation time!';
  static INVALID_OFFER_STATUS_MSG = 'Invalid offer status update request!';
  static CUSTOMER_NOT_FOUND =
    'Account creation failed because customer not found!';
  static LESS_ACCOUNT_LIMIT_MSG =
    'new account limit provided is not greater than current account limit!';
  static LESS_PER_TRANSACTION_LIMIT_MSG =
    'new per transaction limit provided is not greater than current account limit!';
}

const CODE = {
  OK: 200,
  CREATED: 201,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  DEFAULT: 500,
  INCORRECT_PAS_OR_LOG: 401,
  CONFLICT_EMAIL: 409,
};

const MESSAGE = {
  CAST_ERROR: 'Cast Error',
  BAD_REQUEST: 'Bad Request',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  PAGE_NOT_FOUND: 'Page Not Found',
  DEFAULT: 'Error on the server side',
  INCORRECT_PAS_OR_LOG: 'Login or password incorrect',
  CONFLICT_EMAIL: 'A user with such an email already exists',
  NOTLOGIN: 'Log in to your account',
};

module.exports = { CODE, MESSAGE };

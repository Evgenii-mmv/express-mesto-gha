const CODE = {
  OK: 200,
  CREATED: 201,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  DEFAULT: 500,
};

const MESSAGE = {
  BAD_REQUEST: 'Bad Request',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  DEFAULT: 'Error on the server side',
};

module.exports = { CODE, MESSAGE };

const { NotFoundError } = require('../error/notfound');
const { MESSAGE } = require('../code_answer/code_answer');

const notfoundpagerout = (req, res, next) => {
  next(new NotFoundError(MESSAGE.PAGE_NOT_FOUND));
};

module.exports = { notfoundpagerout };

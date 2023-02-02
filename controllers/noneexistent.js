const { BlankPage } = require('../error/blankpage');
const { MESSAGE } = require('../code_answer/code_answer');

const NotFoundError = (req, res, next) => {
  next(new BlankPage(MESSAGE.PAGE_NOT_FOUND));
};

module.exports = { NotFoundError };

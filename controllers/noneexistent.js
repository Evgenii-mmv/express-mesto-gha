const NotFoundError = (req, res, next) => {
  const err = new Error('Not Found');
  err.name = 'NotFoundPage';
  next(err);
};

module.exports = { NotFoundError };

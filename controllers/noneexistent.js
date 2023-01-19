const NotFoundError = (req, res, next) => {
  const err = new Error('Page not found');
  err.name = 'NotFoundPage';
  next(err);
};

module.exports = { NotFoundError };

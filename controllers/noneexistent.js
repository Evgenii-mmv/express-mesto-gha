const NotFoundError = (req, res) => {
  const err = new Error('NotFoundError');
  err.name = 'NotFoundError';
  err.message = 'NotFoundError';
  res.status(404).send(err);
};

module.exports = { NotFoundError };

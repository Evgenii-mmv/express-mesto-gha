const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((e) => next(e));
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        const err = new Error('CastError');
        err.name = 'notFound';
        throw err;
      }
      res.send({ data: user });
    }).catch((e) => next(e));
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => next(e));
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        const err = new Error('User not found');
        err.name = 'notFound';
        throw err;
      }
      res.send({ data: user });
    }).catch((e) => next(e));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        const err = new Error('User not found');
        err.name = 'notFound';
        throw err;
      }
      res.send({ data: user });
    }).catch((e) => next(e));
};

module.exports = {
  getUsers, getUser, createUser, updateProfile, updateAvatar,
};

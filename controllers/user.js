const mongoose = require('mongoose');
const User = require('../models/user');
const { userRes } = require('../utils/utils');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => users.map((user) => userRes(user)))
    .then((users) => res.status(200).send({ data: users }))
    .catch((e) => next(e));
};

const getUser = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send({ message: 'validation error' });
    // validation eeror
  }
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        const err = new Error('User not found');
        err.name = 'CastError';
        throw err;
      }
      res.send(userRes(user));
    }).catch((e) => next(e));
};

const createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(200).send(userRes(user)))
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
        err.name = 'CastError';
        throw err;
      }
      res.send(userRes(user));
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
        err.name = 'CastError';
        throw err;
      }
      res.send(userRes(user));
    }).catch((e) => next(e));
};

module.exports = {
  getUsers, getUser, createUser, updateProfile, updateAvatar,
};

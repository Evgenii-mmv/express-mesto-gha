const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { userRes } = require('../utils/utils');
const { CODE, MESSAGE } = require('../code_answer/code_answer');
const { NotFoundError } = require('../error/notfound');
const { ConflictEmail } = require('../error/conflictemail');

const JWT_SECRET = 'reallysecret';

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(CODE.OK).send(users.map((user) => userRes(user))))
    .catch((e) => next(e));
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(MESSAGE.NOT_FOUND));
      }
      return res.status(CODE.OK).send(userRes(user));
    }).catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CODE.CREATED).send(userRes(user)))
    .catch((e) => {
      if (e.code === 11000) {
        return next(new ConflictEmail(MESSAGE.CONFLICT_EMAIL));
      }
      return next(e);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(MESSAGE.NOT_FOUND));
      }
      return res.status(CODE.OK).send(userRes(user));
    }).catch((e) => next(e));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(MESSAGE.NOT_FOUND));
      }
      return res.status(CODE.OK).send(userRes(user));
    }).catch((e) => next(e));
};
const getMyProfile = (req, res, next) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(MESSAGE.NOT_FOUND));
      }
      return res.status(CODE.OK).send(userRes(user));
    })
    .catch((e) => next(e));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.status(CODE.OK).send({ Token: token });
    }).catch((e) => next(e));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  JWT_SECRET,
  getMyProfile,
};

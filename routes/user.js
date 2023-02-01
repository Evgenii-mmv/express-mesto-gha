const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate'); // у нас нет такой зависимости
const {
  getUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/user');

const RegExp = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

router.get('/', getUsers);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(RegExp),
  }),
}), updateAvatar);

router.use(errors());

module.exports = router;

const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/card');

const RegExp = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

router.get('/', getCards);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(RegExp),
  }),
}), createCard);
router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), likeCard);
router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

router.use(errors());

module.exports = router;

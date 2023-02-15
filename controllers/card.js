const Card = require('../models/card');
const { cardRes } = require('../utils/utils');
const { CODE, MESSAGE } = require('../code_answer/code_answer');
const { NotFoundError } = require('../error/notfound');
const { Forbidden } = require('../error/forbidden');
const { BadRequest } = require('../error/badrequest');
const { CastError } = require('../error/casterror');

const getCards = (req, res, next) => Card.find({})
  .populate('owner likes')
  .then((cards) => res.status(CODE.OK).send(cards.map((card) => cardRes(card))))
  .catch((e) => next(e));

const deleteCard = (req, res, next) => Card.findById(req.params.id)
  .populate('owner likes')
  .then((card) => {
    if (!card) {
      return next(new NotFoundError(MESSAGE.NOT_FOUND));
    }
    if (String(card.owner._id) !== req.user.id) {
      return next(new Forbidden(MESSAGE.FORBIDDEN));
    }

    return card.remove();
  })
  .then((removedCard) => res.status(CODE.OK).send(cardRes(removedCard)))
  .catch((e) => {
    if (e.name === 'CastError') {
      return next(new CastError(MESSAGE.CAST_ERROR));
    }
    return next(e);
  });

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerr = req.user.id;
  Card.create({ name, link, owner: ownerr })
    .then((card) => res.status(CODE.CREATED).send(cardRes(card)))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return next(new BadRequest(MESSAGE.BAD_REQUEST));
      }

      return next(e);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(MESSAGE.NOT_FOUND));
      }
      return res.status(CODE.OK).send(cardRes(card));
    }).catch((e) => {
      if (e.name === 'CastError') {
        return next(new CastError(MESSAGE.CAST_ERROR));
      }
      return next(e);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user.id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError(MESSAGE.NOT_FOUND));
      }
      return res.status(CODE.OK).send(cardRes(card));
    }).catch((e) => {
      if (e.name === 'CastError') {
        return next(new CastError(MESSAGE.CAST_ERROR));
      }
      return next(e);
    });
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};

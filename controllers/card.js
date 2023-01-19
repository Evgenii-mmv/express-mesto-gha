const Card = require('../models/card');
const { cardRes } = require('../utils/utils');

const getCards = (req, res, next) => Card.find({})
  .populate('owner likes')
  .then((cards) => cards.map((card) => cardRes(card)))
  .then((cards) => {
    res.status(200).send({ data: cards });
  })
  .catch((e) => next(e));

const deleteCard = (req, res, next) => Card.findById(req.params.id)
  .populate('owner likes')
  .then((card) => {
    if (!card) {
      const err = new Error('Card not found');
      err.name = 'NotFoundId';
      throw err;
    }
    if (String(card.owner._id) !== req.user._id) {
      const err = new Error('You are not owner');
      err.name = 'AccessError';
      throw err;
    }

    return card.remove();
  })
  .then((removedCard) => res.status(200).send(cardRes(removedCard)))
  .catch((e) => next(e));

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerr = req.user._id;
  Card.create({ name, link, owner: ownerr })
    .then((card) => res.status(200).send(cardRes(card)))
    .catch((e) => next(e));
};

// /likes?id=89&test=8
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.name = 'NotFoundId';
        throw err;
      }
      return res.status(200).send(cardRes(card));
    }).catch((e) => next(e));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.name = 'NotFoundId';
        throw err;
      }
      return res.status(200).send(cardRes(card));
    }).catch((e) => next(e));
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};

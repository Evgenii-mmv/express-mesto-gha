const Card = require('../models/card');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((e) => next(e));

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      res.status(200).send({ data: card });
    }).catch((e) => next(e));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerr = req.user._id;
  Card.create({ name, link, owner: ownerr })
    .then((card) => res.status(200).send({ data: card }))
    .catch((e) => next(e));
};

// /likes?cardId=89&test=8
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('CastError');
        err.name = 'notFound';
        throw err;
      }
      return res.status(200).send({ data: card });
    }).catch((e) => next(e));
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.name = 'notFound';
        throw err;
      }
      return res.status(200).send({ data: card });
    }).catch((e) => next(e));
};

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};

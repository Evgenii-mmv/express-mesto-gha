const mongoose = require('mongoose');
const Card = require('../models/card');
const { cardRes } = require('../utils/utils');

const getCards = (req, res, next) => Card.find({})
  .populate('owner')
  .then((cards) => cards.map((card) => cardRes(card)))
  .then((cards) => {
    res.status(200).send({ data: cards });
  })
  .catch((e) => next(e));

const deleteCard = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send({ message: 'validation error' });
    // validation eeror
  }// найти и удалить
  return Card.findById(req.params.id)
    .populate('owner')
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.name = 'CastError';
        throw err;
      }
      if (String(card.owner._id) !== req.user._id) {
        const err = new Error('You are not owner');
        err.name = 'You are not owner';
        throw err;
      }
      return Card.findOneAndDelete(req.params.id)
        .then((deletecard) => res.status(200).send({ data: deletecard }));
    })
    .catch((e) => next(e));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerr = req.user._id;
  Card.create({ name, link, owner: ownerr })
    .then((card) => res.status(200).send(cardRes(card)))
    .catch((e) => next(e));
};

// /likes?id=89&test=8
const likeCard = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send({ message: 'validation error' });
    // validation eeror
  }
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.name = 'CastError';
        throw err;
      }
      return res.status(200).send(cardRes(card));
    }).catch((e) => next(e));
};

const dislikeCard = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).send({ message: 'validation error' });
    // validation eeror
  }
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const err = new Error('Card not found');
        err.name = 'CastError';
        throw err;
      }
      return res.status(200).send(cardRes(card));
    }).catch((e) => next(e));
};

// Card.findByIdAndUpdate(
//   req.params.id,
//   { $pull: { likes: req.user._id } }, // убрать _id из массива
//   { new: true },
// )
//   .then((card) => {
//     console.log(card);
//     if (!card) {
//       const err = new Error('Card not found');
//       err.name = 'CastError';
//       throw err;
//     }
//     return res.status(200).send(cardRes(card));
//   }).catch((e) => {

//       if (err.name === 'ValidationError' || err.name === 'CastError') {
//         return res.status(400).send({ message: err.message });
//       }
//       // if (err.name === 'CastError') {
//       //   return res.status(404).send({ message: err.message });
//       // }
//       if (err.name === 'You are not owner') {
//         return res.status(500).send({ message: err.message });
//       }
//       return res.status(500).send({ message: err.message });
//     });
// };

module.exports = {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
};

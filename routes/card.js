const router = require('express').Router();
const {
  getCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);
router.delete('/:id', deleteCard);
router.post('/', createCard);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;

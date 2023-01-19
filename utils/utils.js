const cardRes = (card) => ({
  likes: {
    name: card.owner.name,
    about: card.owner.about,
    _id: card.owner._id,
  },
  _id: card._id,
  name: card.name,
  link: card.link,
  owner: {
    name: card.owner.name,
    about: card.owner.about,
    avatar: card.owner.avatar,
    _id: card.owner._id,
  },
  createdAt: card.createdAt,
});

const userRes = (user) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  _id: user._id,
});

module.exports = { userRes, cardRes };

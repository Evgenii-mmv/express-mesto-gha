const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const { PORT = 3000 } = process.env;
// process- глобальный объект с информацией, с которой работает нода
const app = express(); // приложение
// use-используй , туда мы передаем функции промежуточной обработки(мидлевеяры)

app.use(express.static(path.join(__dirname, 'public'))); // экспересс используй эту папку со статическими файлами для раздачи( так мы фронтенд через сервак передаем)
//  преобразование данных в жсон

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

// 63c5560970ded1d3848ad349
app.use((req, res, next) => {
  req.user = {
    _id: '63c5560970ded1d3848ad349',
  };

  next();
});

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));
app.use('/', require('./routes/noneexistent'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  /*
    err.name
      * ValidationError -> 400
      * CastError -> 404
      * else 500
  */

  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: err.message });
  }
  if (err.name === 'CastError') {
    return res.status(404).send({ message: err.message });
  }
  if (err.name === 'You are not owner') {
    return res.status(500).send({ message: err.message });
  }
  return res.status(500).send({ message: err.message });
});

app.listen(PORT);

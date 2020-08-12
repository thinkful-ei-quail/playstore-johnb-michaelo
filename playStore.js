const express = require('express');
const morgan = require('morgan');
const storeData = require('./playstore-data.js');

const app = express();

app.use(morgan('dev'));



app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;

  const validSort = ['Rating', 'App'];
  const validGenre = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

  //Filtering by genre
  if (genres && !validGenre.includes(genres)) {
    return res.status(400).send('Please filter by "Action, Puzzle, Strategy, Casual, Arcade or Card"');
  }

  let filterData = [...storeData];
  
  if (genres) {
    filterData = filterData.filter(app =>
      app.Genres.includes(genres));
  }


  //Sorting
  if (sort && !validSort.includes(sort)) {
    return res.status(400).send('Please sort by either rating or app');
  }

  if (sort &&  sort === 'Rating') {
    filterData = filterData.sort((a, b) => {
      if (a[sort] > b[sort]) {
        return -1;
      } else if (a[sort] < b[sort]) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  
  if (sort && sort === 'App') {
    filterData = filterData.sort((a, b) => {
      if (a[sort].toLowerCase() < b[sort].toLowerCase()) {
        return -1;
      } else if (a[sort].toLowerCase() > b[sort].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  res.json(filterData);
});

module.exports = app;
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../playStore');
const { response } = require('../playStore');

describe('playStore app', () => {
  describe('GET /apps', () => {
    //Default
    it('should return a json from GET /apps', () => {
      return supertest(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    //Sort
    describe('sort queries', () => {
      it('should be 400 if sort is incorrect', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'INVALID-VALUE' })
          .expect(400, 'Please sort by either rating or app');
      });

      const validSorts = ['Rating', 'App'];
      validSorts.forEach(sortValue => {
        it(`should return sorted playStore apps by ${sortValue}`, () => {
          return supertest(app)
            .get('/apps')
            .query({ sort: sortValue })
            .expect(200)
            .expect(response => {
              expect(response.body).to.be.an('array');
              let i = 0, sorted = true;
              while (sorted && i < response.body.length - 1) {
                if (sortValue === 'App') {
                  if (response.body[i][sortValue].toLowerCase() > response.body[i + 1][sortValue].toLowerCase()) {
                    sorted = false;
                  }
                } else
                if (response.body[i][sortValue] < response.body[i + 1][sortValue]) {
                  sorted = false;
                }
                i++;
              }
              expect(sorted).to.be.true;
            });
        });
      });
    });



    describe('filter queries', () => {
      //Filter
      it('should be 400 if filter is incorrect', () => {
        return supertest(app)
          .get('/apps')
          .query({ genres: 'INVALID-VALUE' })
          .expect(400, 'Please filter by "Action, Puzzle, Strategy, Casual, Arcade or Card"');
      });

      const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
      validGenres.forEach(genreValue => {
        it(`should return filtered playStore apps by ${genreValue}`, () => {
          return supertest(app)
            .get('/apps')
            .query({ genres: genreValue })
            .expect(200)
            .expect(response => {
              expect(response.body).to.be.an('array');
              const invalidApp = response.body.find(app => !app.Rating);
              expect(invalidApp).to.be.undefined;
            });
        });
      });
    });



  });
});
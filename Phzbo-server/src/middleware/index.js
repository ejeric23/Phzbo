// eslint-disable-next-line no-unused-vars
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const db = require('../../db/');

module.exports = function (app) {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.
  
  app.get('/auth/google', passport.authenticate('google', { scope: ['email profile'] }));

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    // Successful authentication, redirect home.
      res.redirect('/');
    });

  app.get('/properties/:userId', (req, res) => {
    db.Listings.findAll({ where: { userId: req.params.userId } }).
      then((properties)=> { 
        res.send(properties);
      });
  });

  app.get('/images/:propId', (req, res)=> {
    db.Images.findAll({ where: { listingId: req.params.propId } }).
      then((images) => {
        res.send(images);
      });
  });
};


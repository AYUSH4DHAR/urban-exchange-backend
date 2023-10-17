



var passport = require ('passport'), 
LocalStratergy = require('passport-local').Strategy ;
var User = require('./../models/User')


passport.use('local',new LocalStratergy({
    usernameField:'email',
    passwordField:'password'
},
    function (username, password, done){
        User.findOne({email:username},function (err,user){
            if(err){ return done(err); }
            if(!user){
                return done(null,false,{message: 'Incorrect username or password'})
            }
            if(!user.isValid(password)){
                return done(null,false,{message: 'Incorrect username or password'})
            }
            return done(null,user)
        })
    }
))

var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use('google',new GoogleStrategy({
    clientID: '1074394604196-610lm57lcj94ovdii34lfib07mcolbqj.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    //check user table for anyone with a google ID of profile.id
    User.findOne({
        'email': profile.email
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Google (all the profile. stuff)
        if (!user) {
            user = new User({
               
                name: profile.name.givenName,
                email: profile.email,
                password:User.hashPassword('pass@123'),
                createdAt: Date.now()
               
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            return done(err, user);
        }
    });
}
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
      done(err, user);
    });
  });
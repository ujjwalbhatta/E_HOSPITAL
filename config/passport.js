const LocalStrategy = require("passport-local").Strategy;
const myLocalStrategyAdmin = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");

//call models
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Admin = require("../models/admin");

passport.use(
  "patient",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, done) => {
      //match user
      Patient.findOne({ email: email })
        .then((patient) => {
          if (!patient) {
            return done(null, false, {
              message: "That email is not registerd",
            });
          }

          //match password
          bcrypt.compare(password, patient.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, patient);
            } else {
              return done(null, false, { message: "Password Incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    }
  )
);

passport.use(
  "doctor",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, done) => {
      //match user
      Doctor.findOne({ email: email })
        .then((doctor) => {
          if (!doctor) {
            return done(null, false, {
              message: "That email is not registerd",
            });
          }

          //match password
          bcrypt.compare(password, doctor.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, doctor);
            } else {
              return done(null, false, { message: "Password Incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    }
  )
);

passport.use(
  "admin",
  new myLocalStrategyAdmin(
    { usernameField: "email" },
    (email, password, done) => {
      //match user
      Admin.findOne({ email: email })
        .then((admin) => {
          if (!admin) {
            return done(null, false, {
              message: "That email is not registerd",
            });
          }

          //match password
          bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, admin);
            } else {
              return done(null, false, { message: "Password Incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    }
  )
);

passport.serializeUser(function (patient, done) {
  done(null, patient.id);
});

passport.deserializeUser(function (id, done) {
  Doctor.findById(id, function (err, doctor) {
    if (err) done(err);
    if (doctor) {
      done(null, doctor);
    } else {
      Patient.findById(id, function (err, patient) {
        if (err) done(err);
        if (patient) {
          done(null, patient);
        } else {
          Admin.findById(id, function (err, admin) {
            if (err) done(err);
            done(null, admin);
          });
        }
      });
    }
  });
});

//main concept

// Where does user.id go after passport.serializeUser has been called?
// The user id (you provide as the second argument of the done function) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.

// serializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}

// We are calling passport.deserializeUser right after it where does it fit in the workflow?
// The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see 1.). So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc). In deserializeUser that key is matched with the in memory array / database or any data resource.

// The fetched object is attached to the request object as req.user

// Visual Flow

// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });              │
//                  │
//                  │
//                  └─────────────────┬──→ saved to session
//                                    │    req.session.passport.user = {id: '..'}
//                                    │
//                                    ↓
// passport.deserializeUser(function(id, done) {
//                    ┌───────────────┘
//                    │
//                    ↓
//     User.findById(id, function(err, user) {
//         done(err, user);
//     });            └──────────────→ user object attaches to the request as req.user
// });

// passport.serializeUser(function(admin, done) {
//     done(null, admin.id);
// });

// passport.deserializeUser(function(id, done) {
//    Admin.findById(id, function(err, admin) {
//        done(err, admin);
//    });
// });

// const LocalStrategy = require('passport-local').Strategy;
// const passport = require('passport');
// const bcrypt = require('bcryptjs');

// //Load admin model
// const Admin = require('../models/admin');

// passport.use('admin',new LocalStrategy(
//     {usernameField: 'email'},
//     (email,password,done) => {
//         //match user
//         Admin.findOne({email:email})
//         .then(admin => {
//             if(!admin){
//                 return done(null,false,{message:'That email is not registerd'});
//             }

//         //match password
//         bcrypt.compare(password,admin.password,(err,isMatch) => {
//             if(err) throw err;

//             if(isMatch){
//                 return done(null,admin);
//             }
//             else{
//                 return done(null,false,{message:'Password Incorrect'});
//             }

//         });
//         })
//         .catch(err => console.log(err));
//     })
// );

// passport.serializeUser(function(admin, done) {
//      done(null, admin.id);
// });

// passport.deserializeUser(function(id, done) {
//     Admin.findById(id, function(err, admin) {
//         done(err, admin);
//     });
// });

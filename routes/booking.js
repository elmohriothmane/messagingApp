var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const {Op} = require("sequelize");
const { Booking } = require("../models");
const loginUtilisateur = require('../service/login')
const secret = process.env.JWT_SECRET;
var passport = require("passport");
require("../service/passport")

router.get("/chats/entretien/false", async (req, res, next) => {
  const notAvailable = await Booking.findAll({
    where: {
        type: "entretien",
        isAvailable: false,

    }
    
  });
  
  res.send(notAvailable);
});

router.get("/chats/try/road/false", async (req, res, next) => {
  const notAvailable = await Booking.findAll({
    where: {
        type: "road",
        isAvailable: false,

    }
    
  });
  
  res.send(notAvailable);
}); 

router.get("/chats/try/sport/false", async (req, res, next) => {
  const notAvailable = await Booking.findAll({
    where: {
        type: "sport",
        isAvailable: false,

    }
    
  });
  
  res.send(notAvailable);
});

router.get("/chats/try/at/false", async (req, res, next) => {
  const notAvailable = await Booking.findAll({
    where: {
        type: "AT",
        isAvailable: false,

    }
    
  });
  
  res.send(notAvailable);
});


router.get("/chats/contact/false", async (req, res, next) => {
  const notAvailable = await Booking.findAll({
    where: {
        type: "contact",
        isAvailable: false,

    }
    
  });
  
  res.send(notAvailable);
});

router.post("/new", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  
  Booking.create({
    bookingDate: req.body.bookingDate,
    type: req.body.type,
    UtilisateurIdUtilisateur: req.user.id,
    isAvailable: false,
  });

  res.send('created');
});



module.exports = router;
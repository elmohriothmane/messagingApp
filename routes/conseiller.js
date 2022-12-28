var express = require("express");
var router = express.Router();
var moment = require("moment");
var passport = require("passport");
const loginConseiller = require("../service/loginConseiller");
const jwt = require('jsonwebtoken')
const {
  Conseiller,
  Chat, Utilisateur,MessageChat,
} = require("../models");
const secret = process.env.JWT_SECRET;
require("../service/passport");
/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.render("conseillerLogin", { error: "" });
});
router.post("/login", loginConseiller);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    console.log('here');
      var decoded = jwt.verify(req.cookies["jwt"], secret);
      console.log(decoded)
      Conseiller.findOne({email:decoded.username}).then(data=> {
     Chat.findAll({
       where: {
         ConseillerIdConseiller: data.idConseiller,
       },
       include: [
         {
           model: Utilisateur,
         },
       ],
     }).then((data2) => {
       console.log("conseiller", data2);
       res.render("homeConseiller", { data: data, data2: data2 });
     });    
        console.log(data)

      })
  }
);
router.get("/toggle",(req,res)=> {
        var decoded = jwt.verify(req.cookies["jwt"], secret);
        console.log(decoded)
            Conseiller.findOne({ email: decoded.username }).then((data) => {
              data.available = !data.available
              data.save().then((data)=> {
                console.log(data)
                res.redirect('/conseiller')
              })
            });
});
router.get(
  "/chats2/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    var decoded = jwt.verify(req.cookies["jwt"], secret);
    console.log(decoded);
    Conseiller.findOne({
      where: {
        email: decoded.username,
      },
      include: [
        {
          model: Chat,
          where: {
            idChat: req.params.id,
          },
          include: [
            {
              model: MessageChat,
              include: [
                {
                  model: Utilisateur,
                },
                {
                  model: Conseiller,
                },
              ],
            },
          ],
        },
      ],
    }).then((data) => {
      console.log(data);
      res.render("chatScreenDetailConseiller", {
        data: data,
        moment: moment,
      });
    });
  }
);

router.post("/chats2/sendMessage", (req, res) => {
  var decoded = jwt.verify(req.cookies["jwt"], secret);
  console.log(req.body);
  MessageChat.create({
    ChatIdChat: req.body.ChatIdChat,
    ConseillerIdConseiller: req.body.ConseillerIdConseiller,
    value: req.body.value,
  }).then((data) => {
    console.log(data);
    return res.send(data);
  });
});
module.exports = router;

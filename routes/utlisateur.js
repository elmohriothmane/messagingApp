var express = require("express");
var router = express.Router();
var moment = require("moment");
var jwt = require("jsonwebtoken");
const { Utilisateur, Salon, Demande, Notification,MessageSalon,DemandeConseiller,Chat,Conseiller,MessageChat } = require("../models");
const loginUtilisateur = require('../service/login')
const secret = process.env.JWT_SECRET;
var passport = require("passport");

require("../service/passport")
router.get("/login", function (req, res, next) {
    res.render("utilisateurLogin", { error: "" });
});
router.post('/login',loginUtilisateur)
router.get("/chats/", passport.authenticate('jwt', { session: false }), function (req, res, next) {
  var decoded = jwt.verify(req.cookies["jwt"], secret);
  Utilisateur.findOne({
    where: {
      email: decoded.username, 
    },
    include:[
      {
        model : Salon,
        include : [
          {model: MessageSalon}
        ]
      }, {
        model : Chat, 
        include: [
          {model:Conseiller }
        ]
      }
    ]
  }).then( data=> {
    Salon.findAll().then(salons=> {
      console.log('data',data.Chats)
    res.render("chatScreen", { data: data,salons : salons,message:req.query.message, });
    })
  });
});
router.post("/chats/sendMessage",(req,res)=> {
  var decoded = jwt.verify(req.cookies["jwt"], secret);
  console.log(req.body)
  MessageSalon.create({
    SalonIdSalon: req.body.SalonIdSalon,
    UtilisateurIdUtilisateur: req.body.UtilisateurIdUtilisateur,
    value: req.body.value,
  }).then((data) => {
    console.log(data);
    return res.send(data);
  });
  
});
router.post("/chats2/sendMessage", (req, res) => {
  var decoded = jwt.verify(req.cookies["jwt"], secret);
  console.log(req.body);
  MessageChat.create({
    ChatIdChat: req.body.ChatIdChat,
    UtilisateurIdUtilisateur: req.body.UtilisateurIdUtilisateur,
    value: req.body.value,
  }).then((data) => {
    console.log(data);
    return res.send(data);
  });
});
router.get(
  "/chats/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    var decoded = jwt.verify(req.cookies["jwt"], secret);
    console.log(decoded);
    Utilisateur.findOne({
      where: {
        email: decoded.username,
      },
      include: [
        {
          model: Salon,
          where :  {
            idSalon : req.params.id,
          }, 
          include: [{ model: MessageSalon , 
          include: [{
            model : Utilisateur, 
          }]
          }],
        },
      ],
    }).then((data) => {
      console.log(data);
      res.render("chatScreenDetail", {
        data: data,
        moment: moment,
      });
    });
  }
);
router.get(
  "/chats2/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    var decoded = jwt.verify(req.cookies["jwt"], secret);
    console.log(decoded);
    Utilisateur.findOne({
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
      res.render("chatScreenDetail2", {
        data: data,
        moment: moment,
      });
    });
  }
);
router.post("/salon/envoyerDemande/:id",(req,res)=> {
      var decoded = jwt.verify(req.cookies["jwt"], secret);
        Utilisateur.findOne({
          where: {
            email: decoded.username,
          },
          include: [
            {
              model: Salon,
              required : false,
              where: {
                idSalon: req.params.id,
              },
            },
          ],
        }).then(data=> {
          console.log(data,'data')
          if(data == undefined || data == null ) {
  return res.redirect("/utilisateur/chats?message=");
          }
          console.log(data[0])
          if(data.Salons.length > 0) {
                    return res.send({
                      success: false,
                      message: "vous étes deja dans le groupe",
                    });
          } else {
            Demande.findOne({
              where: {
                SalonIdSalon:req.params.id ,
                UtilisateurIdUtilisateur:data.idUtilisateur ,
              },
            }).then(dataDemande=> {
              if(dataDemande) {
                return res.send({
                  success: false,
                  message: "Vous avez une demande en cours",
                });
              }else {
                Demande.create({
                  SalonIdSalon: req.params.id,
                  UtilisateurIdUtilisateur: data.idUtilisateur,
                }).then(data=> {
                  Demande.findOne({ where : {
                    idDemande : data.idDemande,
                  }, 
                  include: [
                    {model : Salon}, 
                    {
                      model : Utilisateur, 
                    }
                  ]

                  }).then(data=> {
                    return res.send({
                      success: true,
                      message: "Demande envoyé avec succées",
                      data: data,
                    });
                  })


               });
              }
            });
          
          }
        });
});
router.post('/demandeConseiller',(req,res)=> {
  var decoded = jwt.verify(req.cookies["jwt"], secret);
   Utilisateur.findOne({
     where: {
       email: decoded.username,
     },
     include: [
        { model: DemandeConseiller },
       {
         model: Salon,
         include: [{ model: MessageSalon },],
       
       },
     ],
   }).then((data) => {
    if (data.DemandeConseillers.length > 0) {
      return res.send({success : false,message : "vous avez deja une demande",})
    } else {
        DemandeConseiller.create({ UtilisateurIdUtilisateur: data.idUtilisateur }).then(data=> {
                return res.send({
                  success: false,
                  message: "demande envoyé avec succés",
                });

        });   
    }
   });

})
module.exports = router;

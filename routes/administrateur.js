var express = require("express");
var router = express.Router();
var axios = require('axios')
const crypto = require('crypto')
const SSEClient = require("../SSEClient");
const {
  Utilisateur,
  Salon,
  Demande,
  Notification,
  DemandeConseiller,
  Conseiller,
  Chat,
} = require("../models");
var passport = require("passport");
const loginAdministrateur = require("../service/loginAdministrateur");
const { request } = require("http");

require("../service/passport");
router.get("/login", function (req, res, next) {
  res.render("adminLogin", {error:"" });
});
router.post("/acceptDemande/conseiller",(req,res)=> {
  const idConseiller = req.query.idConseiller 
  const idDemande = req.query.idDemande
DemandeConseiller.findOne({
  where: {
    idDemande : idDemande,
  },
}).then(data=> {
  Chat.create({
    UtilisateurIdUtilisateur: data.UtilisateurIdUtilisateur,
    ConseillerIdConseiller: idConseiller,
  }).then((chat) => {
    data.destroy().then((data) => {
      return res.send();
    });
  });
});
});
router.post("/login", loginAdministrateur);
router.get("/",passport.authenticate('jwt', { session: false }), function (req, res, next) {
  res.redirect("/administrateur/salons");
});
router.get("/utilisateurs",passport.authenticate('jwt', { session: false }),(req,res,next)=> {
  Utilisateur.findAll(
    {
      include :  [{
        model : Salon,
      }]
    }
  ).then(data=> {
  console.log(data)
  res.render("ListeUtilisateurAdmin", {
    data:data ,  
  });
  })})
router.get(
  "/salons",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Salon.findAll({
      include: [
        {
          model: Utilisateur,
        },
      ],
    }).then((data) => {
      console.log(data);
      res.render("ListeSalonAdministrateur", {
        data: data,
      });
    });
  }
);
router.get(
  "/demandes",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
   Demande.findAll({
     include: [
       {
         model: Utilisateur,
       },
       {
         model: Salon,
       },
     ],
   }).then((data) => {
    DemandeConseiller.findAll({
      include: [
        {
          model: Utilisateur,
        },
      ],
    }).then((data2) => {
      Conseiller.findAll( {
        where :   {
          available: true , 
        }
      }).then(data3 => {
        console.log(data3.length)
      res.render("ListeDemandeAdministrateur", {
        data: data,
        data2: data2,
        data3 : data3, 
      });
      })

    });
     console.log(data);
    
   });
  }
);
router.get(
  "/notifications",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    Notification.findAll({
    
    }).then((data) => {
      console.log(data);
      res.render("ListeNotificationAdministrateur", {
        data: data,
      });
    });
  }
);
router.get(
  "/notificationsSend",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
     res.render("ListeNotificationAdministrateurEnvoyer", {
      message : "", 
     });
  }
);
router.get(
  "/sendnotiftouser/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.render("ListeNotificationAdministrateurEnvoyerOneUser", {
      message: "",
      id : req.params.id, 
    });
  }
);
router.post("/notification2/:id", (req, res) => {
  if (!req.body.titre || !req.body.description) {
    return res.render("ListeNotificationAdministrateurEnvoyerOneUser", {
      message: "Vous devez remplir tous les champs",
      id: req.params.id,
    });
  }
  const { sse } = require("../app");
  console.log({
    titre: req.body.titre,
    description: req.body.description,
    userId: req.params.id,
  });
  sse.send(
    {
      titre: req.body.titre,
      description: req.body.description,
      userId: req.params.id,
    },
    "message"
  );
res.redirect("/administrateur/utilisateurs");
});
router.post('/notification',(req,res)=> {
  if(!req.body.titre || !req.body.description) {
     return res.render("ListeNotificationAdministrateurEnvoyer", {
       message: "Vous devez remplir tous les champs",
     });
  } 
Notification.create({
  titre: req.body.titre,
  description: req.body.description,
}).then((data) => {

    const {sse} = require('../app')
    console.log(sse)
  sse.send({ titre: req.body.titre, description: req.body.description },'message');
  res.redirect("/administrateur/notificationsSend");
    });
});


router.get('/salons/:id',(req,res,next)=>{
      Salon.findOne( {
        where:  {
          idSalon:  req.params.id
        }
      }).then(data => {
         return res.render("ListeSalonAdministrateurModifier",{
          data: data,
          message : "",
         });
      })
})
router.post("/salon/ajouter/", (req, res) => {
  if (!req.body.max || !req.body.nom) {
    return res.render("ListeSalonAjouter", {
      message: "Vous devez remplir tous les champs",
    });
  }
  Salon.create({
    nom: req.body.nom,
    max: req.body.max,
  }).then((data) => {
    res.redirect("/administrateur/salons");
  });
});
router.post("/salon/:id", (req, res, next) => {
  Salon.findOne({
    where: {
      idSalon: req.params.id,
    },
  }).then((data) => {
    data.max = req.body.max
    data.nom = req.body.nom
    data.save().then(data=> {
       res.redirect('/administrateur/salons')
    })
  });
});
router.get("/salon/remove/:id",(req,res)=> {
  Salon.destroy({where:  {
    idSalon: req.params.id,  
  }}).then(data=> {
  res.redirect("/administrateur/salons");
})
});
router.get("/salon/ajouter/", (req, res) => {
    return res.render("ListeSalonAjouter", {
      message: "",
    });  
});
router.get("/demandes/reject/:id",(req,res)=> {
  Demande.destroy({
    where: {
      idDemande: req.params.id,
    },
  }).then((data) => {
    res.redirect("/administrateur/demandes");
  });
})
router.get("/demandes/accept/:id",(req,res)=> {
  Demande.findOne({where: {
    idDemande : req.params.id, 
  }}).then(demande=> {
    Utilisateur.findOne({
      where: {
        idUtilisateur: demande.UtilisateurIdUtilisateur,
      },
    }).then(user=> {
      Salon.findOne({
        where: {
          idSalon: demande.SalonIdSalon,
        },
      }).then((salon) => {
        user.addSalon(salon).then((data) => {
          Demande.destroy({
            where: {
              idDemande: req.params.id,
            },
          }).then((data) => {
            res.redirect("/administrateur/demandes");
          });
        });
      });
    });
  })
})
module.exports = router;
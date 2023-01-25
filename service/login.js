const { Utilisateur } = require("../models");
const jwt = require('jsonwebtoken');
const bcryptjs = require("bcryptjs");
const secret = process.env.JWT_SECRET;
const loginUtilisateur =  (req, res, next) => {
    const { email,password } = req.body;
    Utilisateur.findOne({
      where: {
        email: email      }
    }).then(async (data) => {
      
    if (data && await(bcryptjs.compare(password, data.password))) {
      const payload = {
        id: data.idUtilisateur,
        username: data.email,
        expiration: Date.now() + parseInt(10000000000),
      }; 
      const token = jwt.sign(JSON.stringify(payload), secret);
      res
        .cookie("jwt", token, {
          httpOnly: true,
          secure: false,
        })
        res.redirect("/utilisateur/chats");
    } else {
      return res.render("utilisateurLogin", { error: "Email ou mot de passe incorrect" });
    }
    
    });
}
module.exports =  loginUtilisateur;

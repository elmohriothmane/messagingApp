const { Utilisateur } = require("../models");
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET;
const loginUtilisateur = (req, res, next) => {
    const { email, password } = req.body;
    Utilisateur.findOne({
      where: {
        email: email,
        password: password, 
      },
    }).then((data) => {
    if (!data) {
  return res.render("utilisateurLogin", { error: "Email ou mot de passe incorrect" });
    } else {
      const payload = {
        username: data.email,
        type: 'utilisateur', 
        expiration: Date.now() + parseInt(10000000000),
      }; 
      const token = jwt.sign(JSON.stringify(payload), secret);
      res
        .cookie("jwt", token, {
          httpOnly: true,
          secure: false,
        })
        res.redirect("/utilisateur/chats");
    }
    });
}
module.exports =  loginUtilisateur;

const { Administrateur } = require("../models");
const jwt = require('jsonwebtoken');
const bcryptjs = require("bcryptjs");

const secret = process.env.JWT_SECRET;
const loginUtilisateur = (req, res, next) => {
    const { email, password } = req.body;
    Administrateur.findOne({
      where: {
        email: email
      }
    }).then(async (data) => {
      if (data && await(bcryptjs.compare(password, data.password))) {
        const payload = {
          id: data.idAdministrateur,
          username: data.email,
          type: "administrateur",
          expiration: Date.now() + parseInt(10000000000),
        };
        const token = jwt.sign(JSON.stringify(payload), secret);
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: false,
        });
        res.redirect("/administrateur");
      } else {
        return res.render("adminLogin", {
          error: "Email ou mot de passe incorrect",
        });
      }
    });
}
module.exports =  loginUtilisateur;

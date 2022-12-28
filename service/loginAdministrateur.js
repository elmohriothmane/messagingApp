const { Administrateur } = require("../models");
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET;
const loginUtilisateur = (req, res, next) => {
    const { email, password } = req.body;
    console.log(email,password)
    Administrateur.findOne({
      where: {
        email: email,
        password: password,
      },
    }).then((data) => {
      console.log(data)
      if (!data) {
        return res.render("adminLogin", {
          error: "Email ou mot de passe incorrect",
        });
      } else {
        const payload = {
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
      }
    });
}
module.exports =  loginUtilisateur;

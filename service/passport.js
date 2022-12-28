const  passport = require('passport')

const passportJWT  = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const secret = process.env.JWT_SECRET
const cookieExtractor = req => {
    let jwt = null 
    if (req && req.cookies) {
        jwt = req.cookies['jwt']
    }
    return jwt
}
passport.use('jwt', new JWTStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: secret
}, (jwtPayload, done) => {
    const {expiration} = jwtPayload;
    if (Date.now() > expiration ) {
        done('Unauthorized', false)
    }
    done(null, jwtPayload)
}))
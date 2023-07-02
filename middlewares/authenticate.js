import jwt from "jsonwebtoken";

const ValidateToken = async function _validatetoken(req, res, next){
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        const token = authHeader.split("Bearer ")[1];
        jwt.verify(token, process.env.Token_Secret, (err, decoded)=>{
            if(err){
                req.body.user = null
                res.status(401).send({
                    succeeded: false,
                    data: null,
                    message: "Invalid token",
                    errors: [err],
                })
            } else {
                req.body.user = decoded;
                next()
            }
        })
    } else {
        req.body.user = null;
        res.status(400).send({
            mesasge: "Invalid Token",
            errors: ["Invalid Token"],
        })
    }
}

const ValidateSocket = function(socket, next){
    const auth_token = socket.handshake.headers.authorization || socket.handshake.headers.Authorization;
    if(auth_token && auth_token.startsWith("Bearer")){
        const access_token = auth_token.split("Bearer ")[1];
        jwt.verify(access_token, process.env.Token_Secret, (err, decoded)=>{
            if(err) return next(new Error('Authentication error'));
            socket.valid_user = decoded;
            socket.join(decoded.username)
            next();
        })
    } else {
        next(new Error('Authentication error'))
    }
}

export {ValidateToken, ValidateSocket};
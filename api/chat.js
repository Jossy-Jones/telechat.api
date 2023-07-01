import { AllChats,ReadChat } from "../models/chat";

const GetChats = async function(req, res){
    let {user} = req.body;
    if(user){}else{
        res.status(401).send({
            succeeded: false,
            message: "Authorization failed",
            data: null,
            error: {
                code: 'auth/bad_auth',
            }
        })
    }
}


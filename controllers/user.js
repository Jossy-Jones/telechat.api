import { AllUsers, ReadUser } from "../models/user.js";

const GetAllUsers = async function (req, res){
    try {
        const _users = await AllUsers();
        if(_users.length > 0){
            const users = [..._users].map((_user)=>{
                return {
                    _id: _user._id,
                    fullname: _user.fullname,
                    username: _user.username,
                }
            });
            res.status(200).send({
                succeeded: true,
                message: "Fetch completed",
                data: users,
                errors: null
            })
        } else {
            res.status(204).send({
                succeeded: true,
                message: "Fetch completed",
                data: [],
                errors: null,
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "Could not fetch users",
            succeeded: false,
            data: null,
            errors: [error]
        })
    }
}

export {GetAllUsers}

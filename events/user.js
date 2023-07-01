const UserEvents = (io, socket) => {
    const userCreated =  function (payload){
        payload = typeof(payload) === "object" ? payload : false;
        if(payload){
            const {username} = payload;
        }
    };

    const online = function (payload){
        
    };

    const offline = function (payload){

    }


    // Event Handlers
    socket.on("user:loggedIn", userCreated)
}

export default UserEvents
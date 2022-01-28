const users=[];

// Push new user to users array
function userJoin(id, username, room)
{
    const user={id, username,room};

    users.push(user);

    return user;
}

// Get current user with id
function getCurrentUser(id)
{
    return users.find(user=> {
        return user.id===id;
    })
}

// User leave --> Xoá array tương ứng với user Leave có ID là id
function userLeave(id)
{
    const index= users.findIndex(user => user.id===id);

    if(index!== -1)
    {
        return users.splice(index,1)[0];
    }
}

// Get room user

function getRoomUsers(room)
{
    return users.filter(user => user.room===room);
}


module.exports={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
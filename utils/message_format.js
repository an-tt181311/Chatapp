//1. Tạo 1 module thư viện tạo cấu trúc tin nhắn.
const moment = require('moment');

function formatMessage(user_name,text){
    return{
        user_name,
        text,
        time: moment().format('h:mm a')    
    };
}

module.exports= formatMessage;
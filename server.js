//=========================== SERVER =========================/

//1. Tạo Express Server
const express = require('express');

//2. Khởi tạo module lấy path
const path= require('path');
const http= require('http');


//3. Require message_format. formatMessage --> định dạng tin nhắn theo cấu trúc để sử dụng chung cho toàn bộ chương trình
const formartMesssage= require('./utils/message_format')

//4. Module users (userJoin & getCurrentUser)
const {userJoin,getCurrentUser,userLeave,getRoomUsers}= require('./utils/users')


                                //HUST0: Về cở bản các câu lệnh require này để require các module mục đích dựng server trả về trang web mà thôi

// Tạo ra 1 ứng dụng express
const app=express();

// Create server instance
const server= http.createServer(app);
const io= require('socket.io')(server);

// Set static folder --> Sau lệnh này có thể khởi chạy http://localhost:3000/
// @Tức là khi running thì client sẽ request lên server và bản thân server sẽ trả về những file có trong folder public
// VD: http://localhost:3000/index.html ==> vào file index.html trong thư mục public
app.use(express.static(path.join(__dirname,"public")));

// khai báo PORT (Nếu không có cổng process.env.PORT thì dùng POR 3000 )
const PORT =process.env.PORT ||  3000

//1. Run server
//@ retrun arrow function & http.Server nếu thành công
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


                                // HUST
// STEP1: Đây là bước mà từ phía Server lắng nghe xem có client nào connect lên Server lên hay không ?
// Lắng nghe sự kiện client connection từ Socket.io nếu sự kiện xảy ra thì thực hiện arrow function
//@ note: connect, disconnect, error là những event mặc định mà người dùng ko thể set
//io --> Tất cả client. socket --> listener client (client vừa join vào)

//@ note: Bản thân mỗi client sẽ có mỗi ID riêng. Ví dụ main.js và main1.js có 2 ID khác nhau 
// và được giải phóng sau khi disconnect. ( Mỗi client có ID socket khác nhau)
// flow main.js --> server --> main.js
io.on('connect',(socket)=> {

                                 // HUST5 BOT- CLIENT
    // Sau khi connect --> Cần phân biệt được client vào phòng nào ?
    socket.on('room_name',({username,room})=>{

        // Vừa là để thêm client mới vào users. vừa lấy id của client vừa join
        // socket.id = id của user
        const user=userJoin(socket.id, username,room);

        // Join vào room
        socket.join(user.room);

        // Socket là vòng tròn connect và nó chỉ gửi đến cho client vừa join vào
        socket.emit('server2client',formartMesssage("Bot","Welcome to chat room"));

        // Gửi cho những client đang trong room đã được xác định từ id socket tru client vua join và trừ client join xong
        socket.broadcast.to(user.room).emit('server2client',formartMesssage("Bot",`${user.username} has joined the chat`));
    


                                // HUST6 Thêm user-> Sidebar 
        // Send user and room infor to SIDEBAR và sẽ gửi cho tất cả mọi người kể cả client join vào
        // Công thức io.to(id).emit --> Tức là đang chat riêng với chỉ room đó mà thôi
        // @ .emit('sự kiện', [string, list...])
        io.to(user.room).emit('room_user',
        {
            // Send infor dưới dạng list key và value
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });    
                                  //BIG TEST
    // socket.on('test',msg=>{
    //      console.log(msg)
    //  })



                                  //SMALL TEST
    // socket.on('test',msg=>{
    //     console.log(msg)
    // })

                                  //HUST2
    // Listen (receive) 'chatMessage' from client
    socket.on('client2server', msg =>{
        
        // Get user thông qua ID
        const user = getCurrentUser(socket.id);

        // Emit vào room xác định
        io.to(user.room).emit('server2client',formartMesssage(user.username,msg));
    })
    
        
    // Disconnect
    socket.on('disconnect',()=> {
        
        // Get user leave through ID
        const user = userLeave(socket.id);

        if(user)
        {
            //Cách 3: Notify for all user. Emit vào room user đó vừa rời khỏi
            io.to(user.room).emit('server2client',formartMesssage("Bot",`${user.username} has left the chat`)) ;
        

                                // HUST6 Thêm user-> Sidebar
            // Send user and room infor to SIDEBAR
            // @ .emit('sự kiện', [string, list...])
            io.to(user.room).emit('room_user',
            {
                // Send infor dưới dạng list key và value
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})



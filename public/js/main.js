// STEP2: Đăng kí socket.io phía client và connect lên server
const socket =io("http://localhost:3000");

//1. Lấy dữ liệu trong box element 'chat-form'
const chatForm= document.getElementById('chat-form'); 
//1. Lấy dữ liệu trong box element 'chat-form'
const chatForm1= document.getElementById('chat-form1'); 


//2. Lấy class 'chat-messages'
const chatClass= document.querySelector('.chat-messages');

//3. Lấy class room-name ở file chat.html
const roomName= document.getElementById('room-name');

//4. Lấy class user ở file chat.html
const userList= document.getElementById('users');


                                  //HUST1
//3. Lắng nghe các sự kiện từ Server (server.js)
socket.on('server2client', message =>{
    //3.1 Ghi ra console
    console.log(message);
    //3.2 Ghi vào chat box
    outputMessage(message);

    //3.3 Scroll down automatically
    chatClass.scrollTop=chatClass.scrollHeight;

})




                          //BIG TEST
// chatForm1.addEventListener('submit',(e)=>{
  
//   //1.1 Dừng hành vi mặc định của bất kì hành động nào. Ví dụ nhấn submit thì gửi form bây h sẽ dừng hành động gửi 
//   e.preventDefault();

//   //1.2 Get data trong box nhập tin nhắn có id="msg" trong thẻ input
//   //e.target.elements."msg".value --> "msg" là tên của id của chatform
//   const msg= e.target.elements.msg.value;
  

//   //1.3 Send message over Socket to Server
//   socket.emit('teston',"ADNCKADKDA");
  
//                                   //HUST TEST
//   // socket.emit('test',"ĐÂY LÀ TEST SOCKET từ A--> SERVER");

//   //1.4 Xoá input sau khi đã gửi message
//   e.target.elements.msg.value='';
//   e.target.elements.msg.focus();
// })
                                



                                  //HUST2 

//@chatForm.addEventListener() với chatForm là document.getElementById('chat-form') lấy bên HTML
//1. Target.addEventListener(tên event, handler function)  thêm 1 sự kiện bằng JS
chatForm.addEventListener('submit',(e)=>{
  
  //1.1 Dừng hành vi mặc định của bất kì hành động nào. Ví dụ nhấn submit thì gửi form bây h sẽ dừng hành động gửi 
  e.preventDefault();

  //1.2 Get data trong box nhập tin nhắn có id="msg" trong thẻ input
  //e.target.elements."msg".value --> "msg" là tên của id của chatform
  const msg= e.target.elements.msg.value;
  

  //1.3 Send message over Socket to Server
  socket.emit('client2server',msg);
  
                                  //SMALL TEST
  // socket.emit('test',"ĐÂY LÀ TEST SOCKET từ A--> SERVER");

  //1.4 Xoá input sau khi đã gửi message
  e.target.elements.msg.value='';
  e.target.elements.msg.focus();
})



                                  // HUST3
// Function xử lý và viết message ra file HTML ở phía client
// Client luôn là phía ghi ra tin nhắn.
function outputMessage(message)
{
  //1. Tạo ra element là 1 thẻ div
  const div = document.createElement('div');

  //2. Thêm các thuộc tính CSS của class "message" trong file chat.html vào thẻ "div" vừa tạo ra
  div.classList.add('message');
  
  //3. Tạo cấu trúc tin nhắn để ghi ra HTML. Truy vấn tên, giờ, message nhờ formatMessage đã return về trước đó
  div.innerHTML=`<p class="meta">${message.user_name} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;

  //4. Thêm thẻ div đã tạo vào phía sau của class chat-messages
  document.querySelector('.chat-messages').appendChild(div);
}

                                //HUST4
//1. Lấy username và room từ URL sử dụng thư viện qs cdn.
//@ Khi đã lấy được username, room sau khi client join vào phòng thì mới emit 
const {username, room} = Qs.parse(location.search,
  {
      // Bỏ qua các kí tự như dấu ? ... trong query string
      ignoreQueryPrefix: true
  });
  console.log(username,room);
  
                                 //HUST5
//1. Sau khi có username, room --> EMIT
// Sự kiện room_name để define xem client join vào phòng nào.
socket.emit('room_name',{username,room});




                                //HUST6: Hiển thị user và room lên sidebar
socket.on('room_user',({room,users})=>
{
    // Hiển thị users và room lên HTML
    outputRoomName(room);
    outputUsers(users);
})


                                // HUST7: Hàm ouput hiển thị HTML users và room
function outputRoomName(room)
{

  // roomName được getbyID ở trên
  roomName.innerText=room;
}

function outputUsers(users)
{

  // phương thức map --> Thay đổi element của 1 mảng đã duyệt qua (các phần tử của 1 mảng được thay đổi như định nghĩa trong hàm)
  // join() --> chuyển array sang string thêm join('')--> viết liên tiếp với nhau

  userList.innerHTML=`
  ${users.map(user=>`<li>${user.username}</li>`).join('')}
  `
}

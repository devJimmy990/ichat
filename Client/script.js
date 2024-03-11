onload = () => {
    const socket = io()
    const counter = document.getElementById("counter");
    const userName = document.getElementById("userName");
    const send = document.getElementById("send");
    const msg = document.getElementById("msg");
    const chatBody = document.getElementById("chatBody");

    send.addEventListener("click", () => {
        const data = {
            user: userName.value,
            msg: msg.value,
            time: new Date()
        }
        socket.emit("msg", data);
        addNewMessage(true, data);
        msg.value = "";
    })
    socket.on("user-counter", (data) => {
        console.log(data > 1);
        counter.textContent = data > 1 ?
            `${data} Members in Room`
            : `Only You in Room`;
    })
    socket.on("chat-msg", (data) => {
        console.log("hiii")
        addNewMessage(false, data);
    });
    msg.addEventListener("focus", (data) => {
        socket.emit("feedback", {
            feedback: `✍️ ${userName.value} typing now....`
        })
    })
   /* msg.addEventListener("keypress", (data) => {
        socket.emit("feedback", {
            feedback: `✍️ ${userName.value} typing now....`
        })
    })

    msg.addEventListener("blur", (data) => {
        socket.emit("feedback", {
            feedback: ""
        })
    })*/
    socket.on("feedback", (data) => {
        clearFeedbackMsg();
        const element = ` 
        <p class="feedback text-center text-white fst-italic">
        ${data.feedback}
      </p>`
        chatBody.innerHTML += element;
    })
    function clearFeedbackMsg() {
        document.querySelectorAll("p.feedback").forEach(element => {
            element.parentNode.removeChild(element);
        })
    }
    function addNewMessage(isOwnMsg, data) {
        clearFeedbackMsg();
        const element = `
    <li class="w-75 border-0 mb-3 border-0 ${isOwnMsg ? "align-self-end  ps-3 pe-2 pt-1" : "align-self-start  ps-2 pe-3"}"
        style="background-color: ${isOwnMsg ? "beige" : "gray"}; color: ${isOwnMsg ? "black" : "white"}; border-radius: ${isOwnMsg ? "20px 0px 20px 20px" : "0px 20px 20px 20px"}; ">
        <p class="message text-wrap">${data.msg}
            <br>
            <span style="font-size:13px;">By <span style="color:purple; font-style:italic; font-weight:bold;">${data.user}</span> : ${moment(data.time).fromNow()}</span>
            </p>
    </li>
    `
        chatBody.innerHTML += element;
    }
}
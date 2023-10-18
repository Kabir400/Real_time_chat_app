const socket = io();
const container = document.querySelector(".container");
const form = document.getElementById("send-container");
const msgInp = document.getElementById("messageInp");
const name = prompt("Enter your name");
let audio = new Audio("audio.mp3");
socket.emit("user-joined", name);

//new user joining message---
socket.on("new-user-joined", (name) => {
  const p = document.createElement("p");
  p.innerText = `${name} joined the chat`;
  p.classList.add("middle");
  container.appendChild(p);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (msgInp.value) {
    socket.emit("chat-message", { msg: msgInp.value, name });
    msgInp.value = "";
  }
});
socket.on("chat-own", (data) => {
  const item = document.createElement("div");
  item.textContent = `you: ${data.msg}`;
  item.classList.add("message", "right");
  container.appendChild(item);
  scrollToBottom();
});

socket.on("chat-others", (data) => {
  const item = document.createElement("div");
  item.textContent = `${data.name}:${data.msg}`;
  item.classList.add("message", "left");
  container.appendChild(item);
  audio.play();
  scrollToBottom();
});

socket.on("leave", (data) => {
  const p = document.createElement("p");
  p.innerText = `${data} leave the chat`;
  p.classList.add("middle");
  container.appendChild(p);
});
function scrollToBottom() {
  container.scrollTop = container.scrollHeight;
}

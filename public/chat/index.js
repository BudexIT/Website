const $ = (q) => document.querySelector(q);

const input = $("#inp");
const submit = $("#sub");
const box = $("#chatbox");

const socket = new WebSocket("wss://" + document.location.host + "/chat-socket");

socket.onopen = (e) => {
	console.log("Logged in");
	
	box.innerText += "Połączono!\nWpisz swój nick:\n";
};
socket.onmessage  = (e) => {
	box.innerText += e.data + "\n";
};
socket.onclose  = (e) => {
	alert("Wypierniczyło cię, weź odśwież czy coś...");
};

submit.onclick = () => {
	console.log("send");
	
	socket.send(input.value);

	input.value = "";
};

window.onkeypress = (e) => {
	if(e.key == "Enter") {
		submit.onclick();
	}
};
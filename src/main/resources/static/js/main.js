/**
 * author : Geonsang
 */
'use strict';

var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('#connecting');

var stompClient = null;
var username = null;

function connect() {
	username = document.querySelector('#username').innerText.trim();
	
	var socket = new SockJS('/ws');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, onConnected, onError);
}

//Connect to WebSocket Server
connect();

//what if succeeded to connect
function onConnected() {
	//receive the message from Public topic
	stompClient.subscribe('/topic/publicChatRoom', onMessageReceived);
	
	//let the server know your name
	stompClient.send("/app/chat.addUser", 
			{}, 
			JSON.stringify({sender: username, type: 'JOIN'})
	);
	
	connectingElement.classList.add('hidden');
}

//what if an error faced
function onError(error) {
	connectingElement.textContent = 'Cannot connect to WebSocket Server!';
	connectingElement.style.color = 'red';
}

//send a message
function sendMessage(event) {
	var messageContent = messageInput.value.trim();
	if(messageContent && stompClient) {
		var chatMessage = {
				sender: username,
				content: messageInput.value,
				type: 'CHAT'
		};
		stompClient.send("/app/chat.sendMessage",
				{},
				JSON.stringify(chatMessage));
		messageInput.value = '';
	}
	event.preventDefault();
}

//what if a message responded
function onMessageReceived(payload) {
	var message = JSON.parse(payload.body);
	var messageElement = document.createElement('li');
	
	if (message.type === 'JOIN') {
		messageElement.classList.add('event-message');
		message.content = message.sender + 'joined!!';
	} else if (message.type === 'LEAVE') {
		messageElement.classList.add('event-message');
		message.content = message.sender + 'left!!';
	} else {
		messageElement.classList.add('chat-message');
		var usernameElement = document.createElement('strong');
		usernameElement.classList.add('nickname');
		var usernameText = document.createTextNode(message.sender);
		usernameElement.appendChild(usernameText);
		messageElement.appendChild(usernameElement);
	}
	
	var textElement = document.createElement('span');
	var messageText = document.createTextNode(message.content);
	textElement.appendChild(messageText);
	
	messageElement.appendChild(textElement);
	messageArea.appendChild(messageElement);
	
	//synchronize current screen
	messageArea.scrollTop = messageArea.scrollHeight;
}

messageForm.addEventListener('submit', sendMessage, true);
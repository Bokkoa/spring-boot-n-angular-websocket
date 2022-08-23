import { Component, OnInit } from '@angular/core';

import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from './models/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private stompClient: Client;
  public connected: boolean = false;
  public message: Message = new Message();
  public messages: Message[] = [];


  constructor() { }

  ngOnInit(): void {
    this.stompClient = new Client();
    this.stompClient.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket");
    }

    this.stompClient.onConnect = (frame) => {
      console.log("Connected: " + this.stompClient.connected + ' : ' + frame );
      this.connected = true;

      this.stompClient.subscribe('/chat/message-received', e => {
        let messageFromSocket:Message = JSON.parse(e.body) as Message; 

        // adding color if the user is new
        if( !this.message.color 
            && messageFromSocket.type == "NEW_USER" 
            && this.message.username == messageFromSocket.username){

          this.message.color = messageFromSocket.color;

        }

        messageFromSocket.date = new Date(messageFromSocket.date);
        this.messages.push( messageFromSocket );
        console.log(messageFromSocket);
      });

      this.message.type = 'NEW_USER';
      this.stompClient.publish({
        destination: '/app/message', // app is a destination prefix
        body: JSON.stringify(this.message)
      });


    }

    this.stompClient.onDisconnect = (frame) => {
      console.log("Disconnected: " + !this.stompClient.connected + ' : ' + frame );
      this.connected = false;

    }


  }

  connect():void{
    this.stompClient.activate();
  }

  disconnect():void{
    this.stompClient.deactivate();
  }

  sendMessage():void{
    this.message.type = 'NEW_MESSAGE';
    this.stompClient.publish({
      destination: '/app/message', // app is a destination prefix
      body: JSON.stringify(this.message)
    });
    // reset messae
    this.message.text = '';
  }

}

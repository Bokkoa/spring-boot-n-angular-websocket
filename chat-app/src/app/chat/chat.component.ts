import { Component, OnInit } from '@angular/core';

import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private stompClient: Client;


  constructor() { }

  ngOnInit(): void {
    this.stompClient = new Client();
    this.stompClient.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket");
    }

    this.stompClient.onConnect = (frame) => {
      console.log("Connected: " + this.stompClient.connected + ' : ' + frame );
    }

    this.stompClient.activate();

  }

}

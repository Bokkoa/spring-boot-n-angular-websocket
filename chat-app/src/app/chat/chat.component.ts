import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  public userWriting: string;
  public clientId: string;

  // scroll always on bottom
  @ViewChild('scrollChat') comment : ElementRef ;  
  scrolltop:null|number=null;

  constructor() {
    this.clientId = 'id-' + new Date().getUTCMilliseconds() + '-' + Math.random().toString(36).substring(2);
   }

  ngOnInit(): void {
    this.stompClient = new Client();
    this.stompClient.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket");
    }

    this.stompClient.onConnect = (frame) => {
      console.log("Connected: " + this.stompClient.connected + ' : ' + frame );
      this.connected = true;

      // START LISTENERS

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
        // updating scrolltop
        this.scrolltop = this.comment.nativeElement.scrollHeight
        console.log(messageFromSocket);
      });


      this.stompClient.subscribe('/chat/user-writing', e => {
        this.userWriting = e.body;  // bokkoa is writing....

        // reseting writing
        setTimeout(() => this.userWriting = '', 3000);
      });


      this.stompClient.subscribe(`/chat/get-history/${this.clientId}`, e => { 
        const history =  JSON.parse(e.body) as Message[];
        // formatting messages from oldest to newest
        // formatting also date
        this.messages = history.map( m => { 
                                      m.date =  new Date( m.date );
                                      return m;
                                    }).reverse();
      });

      // END LISTENERS

      // emmiting history
      this.stompClient.publish({ destination: '/app/history', body: this.clientId});

      this.message.type = 'NEW_USER';
      this.stompClient.publish({
        destination: '/app/message', // app is a destination prefix
        body: JSON.stringify(this.message)
      });


    }

    this.stompClient.onDisconnect = (frame) => {
      console.log("Disconnected: " + !this.stompClient.connected + ' : ' + frame );
      this.connected = false;
      this.messages = [];
      this.message =  new Message();
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



  writingEvent():void{
    this.stompClient.publish({
      destination: '/app/writing', // app is a destination prefix
      body: this.message.username
    });
  }

}

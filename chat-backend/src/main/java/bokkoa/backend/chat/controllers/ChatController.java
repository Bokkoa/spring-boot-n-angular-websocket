package bokkoa.backend.chat.controllers;

import java.util.Date;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import bokkoa.backend.chat.models.documents.Message;

@Controller
public class ChatController {
    
    @MessageMapping("/message") // termination for message received from frontend
    @SendTo("/chat/message") // route for action to other clients subscribed
    public Message receiveMessage(Message message){

        message.setDate(new Date().getTime());
        message.setText("Received by broker: " + message.getText());
        return message;
    }

}

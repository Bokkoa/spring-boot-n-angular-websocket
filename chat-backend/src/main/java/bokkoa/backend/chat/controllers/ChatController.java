package bokkoa.backend.chat.controllers;

import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import bokkoa.backend.chat.models.documents.Message;
import bokkoa.backend.chat.models.service.ChatService;

@Controller
public class ChatController {
    
    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate websocket;

    private String[] colors = {"#F7ECDE", "#E9DAC1", "#9ED2C6", "#54BAB9", "#2C3333", "#395B64", "#A5C9CA"};

    @MessageMapping("/message") // termination for message received from frontend
    @SendTo("/chat/message-received") // route for action to other clients subscribed
    public Message receiveMessage(Message message){
        
        message.setDate(new Date().getTime());

        if( message.getType().equals("NEW_USER")){

            Integer randColor = new Random().nextInt(colors.length);
            message.setColor(colors[randColor]);
            
            message.setText("New user");
        } else{
            // saving data
            chatService.save(message);
        }
        System.out.println(message.getType().equals("NEW_USER"));

        // message.setText("Says: " + message.getText());
        return message;
    }


    @MessageMapping("/writing") // termination for message received from frontend
    @SendTo("/chat/user-writing") // route for action to other clients subscribed
    public String userIsWriting(String username){
        return username.concat(" is writing...");
    }


    @MessageMapping("/history") 
    // @SendTo("/chat/get-history") // for each session only
    public void history(String clientId){
        List<Message> messagesOnHistory = chatService.getLast10Messages();
        websocket.convertAndSend("/chat/get-history/" + clientId, messagesOnHistory);
    }
}

package bokkoa.backend.chat.models.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bokkoa.backend.chat.models.dao.ChatRepository;
import bokkoa.backend.chat.models.documents.Message;

@Service
public class ChatServiceImpl implements ChatService{

    @Autowired
    private ChatRepository chatDao;
    @Override
    public List<Message> getLast10Messages() {
        return chatDao.findFirst10ByOrderByDateDesc();
    }

    @Override
    public Message save(Message message) {
        return chatDao.save(message);
    }
    
}

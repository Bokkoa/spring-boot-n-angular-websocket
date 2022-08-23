package bokkoa.backend.chat.models.service;

import java.util.List;

import bokkoa.backend.chat.models.documents.Message;

public interface ChatService {
    public List<Message> getLast10Messages();
    public Message save(Message message);
}

package bokkoa.backend.chat.models.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import bokkoa.backend.chat.models.documents.Message;

public interface ChatRepository extends MongoRepository<Message, String> {

    // get the first 10 rows in desc order
    public List<Message> findFirst10ByOrderByDateDesc();
}

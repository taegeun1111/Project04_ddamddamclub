package kr.co.ddamddam.chat.service;

import kr.co.ddamddam.chat.dto.request.ChatMessageRequestDTO;
import kr.co.ddamddam.chat.dto.request.ChatRoomRequestDTO;
import kr.co.ddamddam.chat.dto.response.ChatMessageResponseDTO;
import kr.co.ddamddam.chat.dto.response.ChatRoomResponseDTO;
import kr.co.ddamddam.chat.dto.response.UserResponseDTO;
import kr.co.ddamddam.chat.entity.ChatMessage;
import kr.co.ddamddam.chat.entity.ChatRoom;
import kr.co.ddamddam.chat.repository.ChatMessageRepository;
import kr.co.ddamddam.chat.repository.ChatRoomRepository;
import kr.co.ddamddam.user.entity.User;
import kr.co.ddamddam.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public ChatService(ChatRoomRepository chatRoomRepository, ChatMessageRepository chatMessageRepository, UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    public ChatRoomResponseDTO createChatRoom(ChatRoomRequestDTO requestDTO) {
        User sender = userRepository.findById(requestDTO.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid senderId"));

        User receiver = userRepository.findById(requestDTO.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid receiverId"));

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setSender(sender);
        chatRoom.setReceiver(receiver);

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        return convertToChatRoomResponseDTO(savedChatRoom);
    }

    public ChatMessageResponseDTO sendMessage(Long roomId, ChatMessageRequestDTO requestDTO) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid roomId"));

        User sender = userRepository.findById(requestDTO.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid senderId"));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setRoom(chatRoom);
        chatMessage.setSender(sender);
        chatMessage.setContent(requestDTO.getMessage());
        chatMessage.setSentAt(LocalDateTime.now());

        ChatMessage savedChatMessage = chatMessageRepository.save(chatMessage);

        return convertToChatMessageResponseDTO(savedChatMessage);
    }

    private ChatRoomResponseDTO convertToChatRoomResponseDTO(ChatRoom chatRoom) {
        ChatRoomResponseDTO responseDTO = new ChatRoomResponseDTO();
        responseDTO.setRoomId(chatRoom.getRoomId());
        responseDTO.setSender(convertToUserResponseDTO(chatRoom.getSender()));
        responseDTO.setReceiver(convertToUserResponseDTO(chatRoom.getReceiver()));
        return responseDTO;
    }

    private ChatMessageResponseDTO convertToChatMessageResponseDTO(ChatMessage chatMessage) {
        ChatMessageResponseDTO responseDTO = new ChatMessageResponseDTO();
        responseDTO.setMessageId(chatMessage.getId());
        responseDTO.setMessage(chatMessage.getContent());
        responseDTO.setSender(convertToUserResponseDTO(chatMessage.getSender()));
        responseDTO.setSentAt(chatMessage.getSentAt());
        return responseDTO;
    }

    private UserResponseDTO convertToUserResponseDTO(User user) {
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setUserIdx(user.getUserIdx());
        responseDTO.setUserName(user.getUserName());
        responseDTO.setUserNickname(user.getUserNickname());
        return responseDTO;
    }
}


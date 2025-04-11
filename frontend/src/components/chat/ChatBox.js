import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { chatService } from "../../services/chatService";
import ChatMessage from "./ChatMessage";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";

// Styled components
const ChatContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 400px; /* tăng từ 350px */
  height: 500px; /* tăng từ 450px */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f5f5f5;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 8px;

  &:focus {
    outline: none;
    border-color: #4285f4;
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  width: 36px;
  height: 36px;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background: #357abd;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin: 10px 0;
  font-size: 18px; /* Thu nhỏ tiêu đề */
  font-weight: 500;
  background-color: #f5f5f5;
  padding: 5px 0;
  border-radius: 10px 10px 0 0;
`;

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [threadId] = useState(uuidv4());
  const streamedMessageRef = useRef("");

  const dispatch = useDispatch();
  const { current: currentUser } = useSelector((state) => state.user);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    streamedMessageRef.current = "";

    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);

    try {
      setMessages((prev) => [...prev, { text: "", isUser: false }]);

      await chatService.sendMessageStream(
        userMessage,
        threadId,
        currentUser?._id,
        (token) => {
          if (token.startsWith("http")) {
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].image_url = token;
              return newMessages;
            });
          } else {
            streamedMessageRef.current += token;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              lastMessage.text = streamedMessageRef.current;
              return newMessages;
            });
          }
        },
        (error) => {
          console.error("Stream error:", error);
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text =
              "Sorry, something went wrong.";
            return newMessages;
          });
        },
      );
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong.", isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatContainer>
      <Title>Sale Assistant AI</Title>
      <MessagesContainer>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} isUser={message.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <Button onClick={handleSubmit} disabled={isLoading || !input.trim()}>
          {isLoading ? "..." : "▶"}
        </Button>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatBox;

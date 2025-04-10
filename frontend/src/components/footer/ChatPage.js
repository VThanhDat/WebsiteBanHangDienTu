import React, { useState } from "react";
import ChatBox from "../chat/ChatBox";
import styled from "styled-components";
import icons from "../../utils/icons";

const { AiOutlineClose, FiMessageSquare } = icons;

// Styled components
const PageWrapper = styled.div`
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const ChatButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #0056b3;
  }
`;

/**
 * Trang chính của ứng dụng chat
 * Bao gồm:
 * - Layout trang
 * - Component ChatBox để xử lý chat
 * - Nút toggle để hiển thị/ẩn ChatBox
 */
const ChatPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <PageWrapper>
      {isChatOpen && <ChatBox />}
      <ChatButton onClick={toggleChat}>
        {isChatOpen ? (
          <AiOutlineClose size={28} />
        ) : (
          <FiMessageSquare size={28} />
        )}
      </ChatButton>
    </PageWrapper>
  );
};

export default ChatPage;

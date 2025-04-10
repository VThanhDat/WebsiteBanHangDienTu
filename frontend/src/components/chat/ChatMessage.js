import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 16px 20px;
  border-radius: ${(props) =>
    props.isUser ? "20px 20px 0 20px" : "20px 20px 20px 0"};
  background-color: ${(props) => (props.isUser ? "#1a237e" : "#ffffff")};
  color: ${(props) => (props.isUser ? "#ffffff" : "#000000")};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  line-height: 1.5;

  p {
    margin: 0;
  }

  code {
    background-color: ${(props) => (props.isUser ? "#283593" : "#f5f5f5")};
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "Courier New", Courier, monospace;
    font-size: 14px;
  }

  pre {
    background-color: ${(props) => (props.isUser ? "#283593" : "#f5f5f5")};
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  ul,
  ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  table {
    border-collapse: collapse;
    margin: 8px 0;
    width: 100%;

    th,
    td {
      border: 1px solid ${(props) => (props.isUser ? "#283593" : "#e0e0e0")};
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: ${(props) => (props.isUser ? "#283593" : "#f5f5f5")};
    }

    img {
      max-width: 100%;
      max-height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-top: 8px;
    }
  }
`;

const MarkdownImage = styled.img`
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 8px;
  display: block;
`;

const ChatMessage = ({ message, isUser }) => {
  let messageText =
    typeof message.text === "string"
      ? message.text.replaceAll("://", "http://")
      : JSON.stringify(message.text);

  if (Array.isArray(message.text)) {
    const keys = Object.keys(message.text[0]);
    const tableHeader = `| ${keys.join(" | ")} |`;
    const tableDivider = `| ${keys.map(() => "---").join(" | ")} |`;

    const tableRows = message.text
      .map((row) => {
        return `| ${keys.map((key) => row[key]).join(" | ")} |`;
      })
      .join("\n");

    messageText = `${tableHeader}\n${tableDivider}\n${tableRows}`;
  }

  return (
    <MessageContainer isUser={isUser}>
      <MessageBubble isUser={isUser}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ node, ...props }) => <MarkdownImage {...props} />,
          }}
        >
          {messageText}
        </ReactMarkdown>
      </MessageBubble>
    </MessageContainer>
  );
};

export default ChatMessage;

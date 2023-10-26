import { useState, MouseEvent } from "react";
import { io, Socket } from 'socket.io-client';
import axios from "axios";
import { useBotOptions } from "../../../context/BotOptionsContext";
import "./SendButton.css";

const SendButton = ({
	handleSubmit
}: {
	handleSubmit: (event: MouseEvent) => void;
}) => {
	const [inputMessage, setInputMessage] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	
	const sendUserMessage = async () => {
		try {
		  const res = await axios.post('https://stg.api.convoportal.com/api/v1/chat/recivechatWidgetMsg', {
			name: "sheraz",
			email: "amol@gmail.com",
			question: inputMessage,
		  });
		  console.log(res.data);
		} catch (e) {
		  console.log(e);
		}
		if (inputMessage.trim() === "") return;
	
		const userMessage = { id: Date.now(), text: inputMessage, sender: "user" };
		setMessages((prevMessages) => [...prevMessages, userMessage]);
		setInputMessage("");
	  };
	
	// handles options for bot
	const { botOptions } = useBotOptions();

	// tracks if send button is hovered
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// styles for send button
	const sendButtonStyle = {
		backgroundColor: botOptions.theme?.primaryColor,
		...botOptions.sendButtonStyle
	};

	// styles for hovered send button
	const sendButtonHoveredStyle = {
		backgroundColor: botOptions.theme?.secondaryColor,
		...botOptions.sendButtonHoveredStyle
	};
	
	// styles for send icon
	const sendIconStyle = {
		backgroundImage: `url(${botOptions.chatInput?.sendButtonIcon})`,
	};

	/**
	 * Handles mouse enter event on send button.
	 */
	const handleMouseEnter = () => {
		setIsHovered(true);
	};
  
	/**
	 * Handles mouse leave event on send button.
	 */
	const handleMouseLeave = () => {
		setIsHovered(false);
	};
	
	return (
		<div
			// onMouseEnter={handleMouseEnter}
			// onMouseLeave={handleMouseLeave}
			style={isHovered ? sendButtonHoveredStyle : sendButtonStyle}
			// onMouseDown={handleSubmit}
			className="rcb-send-button"
			onClick={sendUserMessage}
		>
			<span className="rcb-send-icon" style={sendIconStyle} />
		</div>
	);
};

export default SendButton;
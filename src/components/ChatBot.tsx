import { useState , useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import axios from "axios";
import ChatBotContainer from "./ChatBotContainer";
import { parseBotOptions } from "../services/BotOptionsService";
import { defaultFlow, isDesktop } from "../services/Utils";
import { BotOptionsContext } from "../context/BotOptionsContext";
import { MessagesContext } from "../context/MessagesContext";
import { PathsContext } from "../context/PathsContext";
import { Options } from "../types/Options";
import { Flow } from "../types/Flow";
import { Message } from "../types/Message";

/**
 * Initializes providers for chatbot.
 *
 * @param flow conversation flow for the bot
 * @param options options to setup the bot
 */
const ChatBot = ({flow,options}: {flow?: Flow,options?: Options}) => {
	
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [agentReply, setAgentReply] = useState<string>("");
	const [userSend, setUserSend] = useState<string>("");
  
	// Simulated backend function to fetch chat messages
	const fetchChatMessages = () => {
	  const socket: Socket = io('https://stg.api.convoportal.com');
	  socket.on('connect', () => {
		console.log('Socket connected');
	  });
  
	  socket.on('sendAgentNotification', (data) => {
		console.log(data);
		setUserSend(data);
	  });
  
	  socket.on('sendAgentReplyNotification', (data) => {
		setTimeout(() => {
		  const botMessage = {
			id: Date.now(),
			text: data,
			sender: "bot",
		  };
		  setMessages((prevMessages) => [...prevMessages, botMessage]);
		}, 1000);
	  });
  
	  // Simulated chat messages
	  const mockMessages = [
		{ id: 1, text: userSend, sender: "user" },
		{ id: 2, text: agentReply, sender: "bot" },
		{ id: 3, text: "How can I help you?", sender: "bot" },
		{ id: 3, text: "console.log(repair).maps.string.reverse().join(_)" },
	  ];
  
	  // Simulate a slight delay (in milliseconds) for API call
	  setTimeout(() => {
		setMessages(mockMessages);
	  }, 500);
	};
  
	// Simulated backend function to send user message
	
	// Fetch chat messages on component mount
	useEffect(() => {
	  fetchChatMessages();
	}, []);
  
	// handles setting of options for the chat bot
	const [botOptions, setBotOptions] = useState<Options>(parseBotOptions(options));

	// handles messages between user and the chat bot

	// handles paths of the user
	const [paths, setPaths] = useState<string[]>(["start"]);

	// provides a default welcome flow if no user flow provided
	const parsedFlow: Flow = flow ?? defaultFlow;

	/**
	 * Wraps bot options provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapBotOptionsProvider = (children: JSX.Element) => {
		return (
			<BotOptionsContext.Provider value={{botOptions, setBotOptions}}>
				{children}
			</BotOptionsContext.Provider>
		);
	};

	/**
	 * Wraps paths provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapPathsProvider = (children: JSX.Element) => {
		return (
			<PathsContext.Provider value={{paths, setPaths}}>
				{children}
			</PathsContext.Provider>
		);
	};

	/**
	 * Wraps messages provider around child element.
	 * 
	 * @param children child element to wrap around
	 */
	const wrapMessagesProvider = (children: JSX.Element) => {
		return (
			<MessagesContext.Provider value={{messages, setMessages}}>
				{children}
			</MessagesContext.Provider>
		);
	};

	/**
	 * Renders chatbot with providers based on given options.
	 */
	const renderChatBot = () => {
		let result = <ChatBotContainer flow={parsedFlow}/>;
		if (!botOptions.advance?.useCustomMessages) {
			result = wrapMessagesProvider(result);
		}

		if (!botOptions.advance?.useCustomPaths) {
			result = wrapPathsProvider(result);
		}

		if (!botOptions.advance?.useCustomBotOptions) {
			result = wrapBotOptionsProvider(result);
		}

		return result;
	}

	/**
	 * Checks if chatbot should be shown depending on platform.
	 */
	const shouldShowChatBot = () => {
		return (isDesktop && botOptions.theme?.desktopEnabled)
			|| (!isDesktop && botOptions.theme?.mobileEnabled);
	}

	return (
		<>
			{shouldShowChatBot() &&
				<div style={{fontFamily: botOptions.theme?.fontFamily}}>
					{renderChatBot()}
				</div>
			}
		</>
	);
};

export default ChatBot;
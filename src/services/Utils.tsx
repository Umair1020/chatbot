import { Params } from "../types/Params";

const helpOptions = ["Quickstart", "API Docs", "Examples", "Github", "Discord"];

// default provided welcome flow if user does not pass in a flow to the chat bot
export const defaultFlow = {
	repeat: {
		transition: { duration: 3000 },
		path: "prompt_again"
	},
}

// boolean indicating if user is on desktop (otherwise treated as on mobile)
export const isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
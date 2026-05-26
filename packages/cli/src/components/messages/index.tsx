// This file is the central station for chat messages!
// It collects and exports all message types (user messages, bot replies, and error blocks)
// so that other parts of the app can easily import them in a clean way.

export {ErrorMessage} from "./error-message"
export {UserMessage} from "./user-message"
export {BotMessage} from "./bot-message"

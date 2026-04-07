import { Box } from "ink";
import { useState } from "react";

import type { Agent } from "@/agent";
import type { NonSystemMessage, UserMessage } from "@/foundation";

import { Header } from "./components/header";
import { InputBox } from "./components/input-box";
import { LoadingIndicator } from "./components/loading-indicator";
import { MessageHistory } from "./components/message-history";

export function App({ agent }: { agent: Agent }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<NonSystemMessage[]>([]);
  const handleSubmit = async (text: string) => {
    if (text === "exit" || text === "quit" || text === "/exit" || text === "/quit") {
      process.exit(0);
      return;
    }
    if (text === "/clear") {
      setMessages([]);
      return;
    }

    if (loading) return;
    setLoading(true);

    const userMessage: UserMessage = { role: "user", content: [{ type: "text", text }] };
    setMessages([...messages, userMessage]);
    const stream = await agent.stream(userMessage);
    for await (const message of stream) {
      setMessages((messages) => [...messages, message]);
    }

    setLoading(false);
  };
  return (
    <Box flexDirection="column" rowGap={1} width="100%">
      <Header />
      <MessageHistory messages={messages} isBusy={loading} />
      <LoadingIndicator loading={loading} />
      <InputBox onSubmit={handleSubmit} />
    </Box>
  );
}

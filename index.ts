import { createCodingAgent } from "helixent/coding";
import { OpenAIModelProvider } from "helixent/community/openai";
import { Model } from "helixent/foundation";

const provider = new OpenAIModelProvider({
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
  apiKey: process.env.ARK_API_KEY,
});

const model = new Model("ep-20260311141959-w8cpr", provider, {
  max_tokens: 16 * 1024,
  thinking: {
    type: "enabled",
  },
});

const agent = await createCodingAgent({ model });

async function main() {
  const stream = await agent.stream({
    role: "user",
    // It will trigger the skill "skill-creator" to create a modern website for Helixent according to the README.md file.
    content: [
      {
        type: "text",
        text: "Design and make a modern website for Helixent according to the README.md file. And put it in the `website/` folder.",
      },
    ],
  });

  for await (const message of stream) {
    for (const content of message.content) {
      if (content.type === "thinking" && content.thinking) {
        console.info("💡", content.thinking);
      } else if (content.type === "text" && content.text) {
        console.info(content.text);
      } else if (content.type === "tool_use") {
        if (content.name === "read_file") {
          console.info("🗒", content.input.description);
          console.info("  Reading file", content.input.path);
        } else if (content.name === "write_file") {
          console.info("✏️ Writing file", content.input.path);
        } else if (content.name === "str_replace") {
          console.info("✏️ Replacing string in file", content.input.description);
          console.info("  Replacing", content.input.path, content.input.old, "with", content.input.new);
        } else if (content.name === "bash") {
          console.info("💻", content.input.description);
          console.info("  Executing command", content.input.command);
        } else {
          if (content.input.description) {
            console.info("🔧", content.input.description);
          } else {
            console.info("🔧", content.name);
          }
        }
      }
      console.info();
    }
  }
}

await main();

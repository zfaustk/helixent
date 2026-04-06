import z from "zod";

import { defineTool } from "@/foundation";

export const writeFileTool = defineTool({
  name: "write_file",
  description: "Write to a file at an absolute path.",
  parameters: z.object({
    description: z
      .string()
      .describe("Explain why you want to write to the file. Always place `description` as the first parameter."),
    path: z.string().describe("The absolute path to the file to write to."),
    content: z.string().describe("The content to write to the file."),
  }),
  invoke: async ({ path, content }) => {
    const file = Bun.file(path);
    await file.write(content);
  },
});

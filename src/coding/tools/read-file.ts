import z from "zod";

import { defineTool } from "@/foundation";

export const readFileTool = defineTool({
  name: "read_file",
  description: "Read a file from an absolute path.",
  parameters: z.object({
    description: z
      .string()
      .describe("Explain why you want to read the file. Always place `description` as the first parameter."),
    path: z.string().describe("The absolute path to the file to read."),
  }),
  invoke: async ({ path }) => {
    const file = Bun.file(path);
    if (!(await file.exists())) {
      return `Error: File ${path} does not exist.`;
    }
    return await file.text();
  },
});

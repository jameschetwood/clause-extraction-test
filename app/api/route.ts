/* For reason the default import doens't work. Solution from here: https://stackoverflow.com/questions/76345917/read-pdf-content-in-next-js-13-api-route-handler-results-in-404

TODO Investigate this further than consider using a different library.
     Remove pdf-parse.d.ts when not needed.
*/
import pdfParse from "pdf-parse/lib/pdf-parse";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return Response.json(
        { error: "No file or invalid file provided" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(buffer));

    // todo make response be markdown
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: data.text,
      system: `You are a helpful assistant that extracts salient legal clauses from legal documents.

At a minimum the Indemnification, Termination, and Liability clauses must be extracted if in the original text.

If no legal clauses are found, respond with only "No legal clauses found.
`,
    });

    return Response.json({ clauses: text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return Response.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}

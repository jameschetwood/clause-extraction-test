/* For reason the default import doens't work. Solution from here: https://stackoverflow.com/questions/76345917/read-pdf-content-in-next-js-13-api-route-handler-results-in-404

TODO Investigate this further than consider using a different library.
     Remove pdf-parse.d.ts when not needed.
*/
import pdfParse from "pdf-parse/lib/pdf-parse";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
// export async function GET(request: Request) {
//   //   const formData = await request.formData();
//   //   console.log(formData);
//   return new Response("Hello, world!");
// }

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return Response.json(
      { error: "No file or invalid file provided" },
      { status: 400 }
    );
  }

  try {
    const buffer = await file.arrayBuffer();
    const data = await pdfParse(Buffer.from(buffer));
    console.log("PDF Text:", data.text);

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: "Write a vegetarian lasagna recipe for 4 people.",
    });

    return Response.json({ text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return Response.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}

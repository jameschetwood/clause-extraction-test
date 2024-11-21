/* For reason the default import doens't work. Solution from here: https://stackoverflow.com/questions/76345917/read-pdf-content-in-next-js-13-api-route-handler-results-in-404

TODO Investigate this further than consider using a different library.
     Remove pdf-parse.d.ts when not needed.
*/
import pdfParse from "pdf-parse/lib/pdf-parse";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const dummyRes = `## General Indemnity
SaaS agreements often include a provision – known as a “general indemnity” – that requires a party (usually the customer, but sometimes also the service provider) to protect the other party against certain kinds of claims by third parties and resulting liabilities to third parties. The customer should understand the burdens and benefits of general indemnity provisions and manage risk through prudent business practices and insurance for residual risk.

## Term, Suspension and Termination
SaaS subscriptions and ancillary services are usually time-limited and subject to suspension or early termination in specified circumstances. The customer should understand the term of each SaaS subscription and ancillary services and take reasonable precautions to properly exercise renewal rights and avoid suspension or unintended early termination.

## Remedy Restrictions/Liability Limitations and Exclusions
SaaS agreements usually contain provisions that limit the customer’s rights and remedies against the service provider for damage, loss or liabilities caused by the service provider’s breach of the agreement or other misconduct. The customer should understand the risk allocation resulting from those provisions, and manage and mitigate risk through prudent business practices and insurance.`;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  const dummy = false;

  // todo remove this
  if (dummy) {
    return Response.json({ clauses: dummyRes });
  }

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

    /*
    I had to add some formatting examples to make the prompt respond in valid markdown.
    TODO: Investigate why this is needed. I'm worries this will influence the model eg make it less likely to use lists as lists were not provided as example formatting.
    */
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: data.text,
      system: `You are a helpful assistant that extracts salient legal clauses from legal documents.

At a minimum the Indemnification, Termination, and Liability clauses must be extracted if in the original text.

If no legal clauses are found, respond with only "No legal clauses found".

Do not include a generic heading like "Extracted Legal Clauses".

You must always respond in valid markdown eg:

# Heading level 1
## Heading level 2
### Heading level 3		
Paragraphs with **bold text** and *italic text*.
`,
    });

    return Response.json({ clauses: text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return Response.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}

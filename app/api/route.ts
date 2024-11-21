// import pdfParse from "pdf-parse";
import pdfParse from "pdf-parse/lib/pdf-parse";

// export async function GET(request: Request) {
//   //   const formData = await request.formData();
//   //   console.log(formData);
//   return new Response("Hello, world!");
// }

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

    return Response.json({ text: data.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return Response.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}

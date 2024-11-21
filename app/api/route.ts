// export async function GET(request: Request) {
//   //   const formData = await request.formData();
//   //   console.log(formData);
//   return new Response("Hello, world!");
// }

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  console.log({ file });
  return Response.json({ message: "Hello, world!" });
}

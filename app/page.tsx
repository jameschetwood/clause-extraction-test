"use client";
export default function Home() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted");
  }

  return (
    <div>
      <h1>Clause Extraction Tech Test</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log("Selected file:", file);
            }
          }}
        />
      </form>
    </div>
  );
}

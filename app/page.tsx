"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    const response = await fetch("/api", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log({ data });
  }

  return (
    <div className="flex flex-col p-8">
      <h1>Clause Extraction Tech Test</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
            }
          }}
        />

        <button type="submit" className="bg-blue-200 p-4 rounded">
          Extract Clauses
        </button>
      </form>
    </div>
  );
}

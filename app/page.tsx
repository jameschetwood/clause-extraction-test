"use client";

import { useState } from "react";

type FetchStatus =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "success";
      clauses: string;
    }
  | {
      status: "error";
      error: string;
    };

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>({
    status: "idle",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setFetchStatus({ status: "loading" });

      const formData = new FormData();
      if (!file) {
        setFetchStatus({
          status: "error",
          error: "Please choose a file to extract clauses from",
        });
        return;
      }
      formData.append("file", file);

      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch clauses");
      }
      const data = await response.json();
      if (!data.clauses || typeof data.clauses !== "string") {
        throw new Error("Failed to fetch clauses");
      }
      setFetchStatus({ status: "success", clauses: data.clauses });
    } catch (error) {
      setFetchStatus({ status: "error", error: "Failed to fetch clauses" });
    }
  }

  return (
    <div className="flex flex-col p-8">
      <h1>Clause Extraction Tech Test</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-start mb-4"
      >
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

        <button
          disabled={fetchStatus.status === "loading"}
          type="submit"
          className="bg-blue-200 p-4 rounded"
        >
          {fetchStatus.status === "loading"
            ? "Extracting..."
            : "Extract Clauses"}
        </button>
      </form>
      <div>
        {fetchStatus.status === "success" && <pre>{fetchStatus.clauses}</pre>}
        {fetchStatus.status === "error" && (
          <p className="bg-red-400">{fetchStatus.error}</p>
        )}
      </div>
    </div>
  );
}

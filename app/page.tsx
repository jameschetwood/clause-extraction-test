"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import Alert from "./components/Alert";

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
    status: "error",
    error: "Please choose a file to extract clauses from",
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

      <form onSubmit={handleSubmit} className="flex  gap-4 items-start mb-4">
        <input
          className="file-input file-input-bordered"
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
          className="btn btn-primary min-w-[9rem] flex items-center justify-center"
        >
          {fetchStatus.status === "loading" ? (
            <>
              <span>Extracting</span>
              <span className="loading loading-dots loading-xs"></span>
            </>
          ) : (
            "Extract Clauses"
          )}
        </button>
      </form>
      <div>
        {fetchStatus.status === "success" && (
          <div className="prose">
            <Markdown>{fetchStatus.clauses}</Markdown>
          </div>
        )}

        {fetchStatus.status === "error" && <Alert>{fetchStatus.error}</Alert>}
      </div>
    </div>
  );
}

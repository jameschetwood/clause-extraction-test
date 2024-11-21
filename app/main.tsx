"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import Alert from "./components/Alert";
import Card from "./components/Card";

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

export default function Main() {
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
    <div className="flex-col p-8 grid grid-cols-[1fr_3fr] gap-8 items-start">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Clause Extraction</h1>

          <form onSubmit={handleSubmit} className="flex gap-4 items-start mb-4">
            <input
              className="file-input file-input-bordered w-[240px] xl:w-auto"
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
        </div>
      </Card>

      {fetchStatus.status === "success" && (
        <Card verticalScrollable>
          <div className="prose">
            <Markdown>{fetchStatus.clauses}</Markdown>
          </div>
        </Card>
      )}

      {fetchStatus.status === "error" && (
        <Card verticalScrollable>
          <Alert>{fetchStatus.error}</Alert>
        </Card>
      )}
    </div>
  );
}

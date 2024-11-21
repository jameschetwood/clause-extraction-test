"use client";

import { useState } from "react";
import Markdown from "react-markdown";
import Alert from "./components/Alert";
import Card from "./components/Card";
import { useMutation } from "@tanstack/react-query";

export default function Main() {
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("No file provided");
      }

      const formData = new FormData();
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

      return data.clauses;
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate();
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
              disabled={mutation.isPending}
              type="submit"
              className="btn btn-primary min-w-[9rem] flex items-center justify-center"
            >
              {mutation.isPending ? (
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

      {mutation.isSuccess && (
        <Card verticalScrollable>
          <div className="prose">
            <Markdown>{mutation.data}</Markdown>
          </div>
        </Card>
      )}

      {mutation.isError && (
        <Card verticalScrollable>
          <Alert>{(mutation.error as Error).message}</Alert>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import Markdown from "react-markdown";
import Alert from "./components/Alert";
import Card from "./components/Card";
import { useMutation } from "@tanstack/react-query";
import { WandSparkles } from "lucide-react";
import { z } from "zod";
import { actAddExtraction } from "./store";

// Potentially overkill for this simple example but useful on more complex applications
const resSchema = z.object({
  clauses: z.string(),
  date: z.string(),
  fileName: z.string(),
});

export default function Main() {
  const [file, setFile] = useState<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("No file provided");
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api", {
          method: "POST",
          body: formData,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch clauses");
        }

        const data = await response.json();

        try {
          const parsed = resSchema.parse(data);
          return parsed;
        } catch (error) {
          throw new Error("Failed to parse clauses");
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return null;
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data) {
        actAddExtraction(data);
      }
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="flex-col grid grid-cols-[1fr_2fr] gap-8 items-start w-full">
      <Card>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">
            Clause Extraction{" "}
            <WandSparkles className="inline-block w-4 text-gray-500" />
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-start"
          >
            <input
              className="file-input file-input-bordered xl:w-auto"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                  }
                  setFile(file);
                } else {
                  setFile(null);
                }
              }}
            />

            <button
              disabled={mutation.isPending}
              type="submit"
              className="btn btn-primary min-w-[9rem] flex items-center justify-center w-full"
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

      {mutation.isSuccess && mutation.data && (
        <Card verticalScrollable>
          <div className="prose">
            <Markdown>{mutation.data.clauses}</Markdown>
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

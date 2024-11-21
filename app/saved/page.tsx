"use client";

import { useSnapshot } from "valtio";
import { state } from "../store";

export default function SavedPage() {
  const snapshot = useSnapshot(state);
  return <div>{snapshot.extractions.map((e) => e.date).join(", ")}</div>;
}

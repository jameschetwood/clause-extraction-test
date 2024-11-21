"use client";

import { useSnapshot } from "valtio";
import { state } from "../store";
import { format } from "date-fns";
import Card from "../components/Card";

export default function SavedPage() {
  const snapshot = useSnapshot(state);
  return (
    <Card>
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Filename</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.extractions.map((e) => (
              <tr key={e.date}>
                <td>{format(new Date(e.date), "dd LLLL yyyy")}</td>
                <td>{e.fileName}</td>
                <td>
                  {e.clauses.length > 100
                    ? e.clauses.slice(0, 100) + "..."
                    : e.clauses}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

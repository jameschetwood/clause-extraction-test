import { proxy } from "valtio";

type Store = {
  extractions: {
    clauses: string;
    date: string;
    fileName: string;
  }[];
};

export function actAddExtraction({
  clauses,
  date,
  fileName,
}: {
  clauses: string;
  date: string;
  fileName: string;
}) {
  state.extractions.push({ clauses, date, fileName });
}

export const state = proxy<Store>({
  extractions: [],
});

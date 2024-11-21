import { proxy } from "valtio";

type Store = {
  extractions: {
    clauses: string;
    date: string;
  }[];
};

export function actAddExtraction(clauses: string, date: string) {
  state.extractions.push({ clauses, date });
}

export const state = proxy<Store>({
  extractions: [],
});

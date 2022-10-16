import { writable,derived } from 'svelte/store';

export enum EntryTypes {
incoming,
outgoing
}

export type IEntry = {
  description: string,
  value: number,
  type: EntryTypes
};

const storedEntries = ((JSON.parse(localStorage.getItem("entries"))) ?? []) as Array<IEntry>;

export const entries = writable<Array<IEntry>>(storedEntries);

entries.subscribe(entries => {
  localStorage.setItem("entries", JSON.stringify(entries));
});

export const incomingTotal = derived(entries, (entries) => {
  return entries.reduce((acc, entry) => {
    if (Number(entry.type) === EntryTypes.incoming) {
      return acc + entry.value;
    }

    return acc;
  }, 0);
});

export const outgoingTotal = derived(entries, (entries) => {
  return entries.reduce((acc, entry) => {
    if (Number(entry.type) === EntryTypes.outgoing) {
      return acc + entry.value;
    }

    return acc;
  }, 0);
});

export const balance = derived([incomingTotal, outgoingTotal], ([incomingTotal, outgoingTotal]) => {
  return incomingTotal - outgoingTotal;
});
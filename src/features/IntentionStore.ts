import { create } from "zustand";

interface Intention {
  id: number;
  text: string;
}

interface IntentionState {
  intentions: Intention[];
  addIntention: (intention: Intention) => void;
  //   removeIntention: (id: number) => void;
}

export const useIntentionStore = create<IntentionState>()((set, get) => ({
  intentions: [],
  addIntention: (intention: Intention) => {
    set((state) => ({
      intentions: [...state.intentions, intention],
    }));
  },
}));

import { create } from "zustand";
import { DiscoveryAnswer, DiscoveryResult, IntakeState, Proposal } from "./types";

export type Step =
  | "discover"
  | "analyze"
  | "architect"
  | "generating"
  | "propose";

interface AppState {
  step: Step;
  intake: IntakeState;
  discoveryResult: DiscoveryResult | null;
  proposal: Proposal | null;
  proposalHistory: Proposal[];
  isLoading: boolean;
  error: string | null;

  setStep: (step: Step) => void;
  updateClient: (patch: Partial<IntakeState["client"]>) => void;
  updateGoals: (patch: Partial<IntakeState["goals"]>) => void;
  toggleService: (service: string) => void;
  setDiscoveryAnswers: (answers: DiscoveryAnswer[]) => void;
  setDiscoveryResult: (result: DiscoveryResult) => void;
  setProposal: (proposal: Proposal) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const emptyIntake: IntakeState = {
  client: {
    companyName: "",
    industry: "",
    companySize: "",
    region: "",
    existingWebsite: "",
    budgetRange: "",
    contactPerson: "",
    contactEmail: "",
  },
  goals: { selected: [], freeText: "" },
  services: { selected: [] },
  discoveryAnswers: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  step: "discover",
  intake: emptyIntake,
  discoveryResult: null,
  proposal: null,
  proposalHistory: [],
  isLoading: false,
  error: null,

  setStep: (step) => set({ step }),
  updateClient: (patch) =>
    set((s) => ({ intake: { ...s.intake, client: { ...s.intake.client, ...patch } } })),
  updateGoals: (patch) =>
    set((s) => ({ intake: { ...s.intake, goals: { ...s.intake.goals, ...patch } } })),
  toggleService: (service) =>
    set((s) => {
      const has = s.intake.services.selected.includes(service as any);
      const selected = has
        ? s.intake.services.selected.filter((sv) => sv !== service)
        : [...s.intake.services.selected, service as any];
      return { intake: { ...s.intake, services: { selected } } };
    }),
  setDiscoveryAnswers: (answers) =>
    set((s) => ({ intake: { ...s.intake, discoveryAnswers: answers } })),
  setDiscoveryResult: (result) => set({ discoveryResult: result }),
  setProposal: (proposal) =>
    set((s) => ({
      proposal,
      proposalHistory: [...s.proposalHistory, proposal],
      step: "propose",
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      step: "discover",
      intake: emptyIntake,
      discoveryResult: null,
      proposal: null,
      error: null,
    }),
}));

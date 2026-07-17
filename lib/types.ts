// Core domain types shared across the wizard, API routes, and proposal document.

export type ClientPersonality =
  | "Startup Founder"
  | "Enterprise Client"
  | "Technical Founder"
  | "Non-Technical Business Owner";

export interface ClientInfo {
  companyName: string;
  industry: string;
  companySize: string; // "1-10" | "11-50" | "51-200" | "200+"
  region: string;
  existingWebsite?: string;
  budgetRange: string; // "<$10k" | "$10k-$25k" | "$25k-$50k" | "$50k+"
  contactPerson: string;
  contactEmail?: string;
}

export interface BusinessGoals {
  selected: string[]; // e.g. "Increase sales", "Automate operations"
  freeText: string; // client's own description of what they need, in their words
}

export const SERVICE_OPTIONS = [
  "Web Development",
  "Mobile App Development",
  "AI Solutions",
  "Automation",
  "Chatbot Development",
  "Cloud Infrastructure",
  "Data Analytics",
  "UI/UX Design",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export interface RequestedServices {
  selected: ServiceOption[];
}

export interface DiscoveryAnswer {
  question: string;
  answer: string;
}

export interface IntakeState {
  client: ClientInfo;
  goals: BusinessGoals;
  services: RequestedServices;
  discoveryAnswers: DiscoveryAnswer[];
}

// ---- AI-generated proposal document ----

export interface ScopeRisk {
  risk: string;
  impact: string;
  likelihood: "Low" | "Medium" | "High";
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  description: string;
}

export interface TeamRole {
  role: string;
  allocation: number; // percentage 0-100
}

export interface PricingPackage {
  name: "Startup" | "Growth" | "Enterprise";
  priceRange: string;
  includes: string[];
}

export interface CompletenessBreakdown {
  businessGoals: number;
  technicalRequirements: number;
  budgetInformation: number;
  timelineExpectations: number;
  overall: number;
}

export interface QualityScore {
  overall: number; // 0-100
  strengths: string[];
  weaknesses: string[];
}

export interface ScopeCreepAssessment {
  riskLevel: "Low" | "Medium" | "High";
  reasons: string[];
  recommendation: string;
  phasingSuggestion?: { phase: string; features: string[] }[];
}

export interface ArchitectureRecommendation {
  stack: string[];
  reasoning: string[];
}

export interface ROIForecast {
  currentCostEstimate: string;
  projectedCostAfter: string;
  estimatedAnnualSavings: string;
  operationalEfficiencyGainPct: string; // e.g. "25-35%"
  narrative: string;
}

export interface DealProbability {
  probabilityPct: number;
  positiveFactors: string[];
  negativeFactors: string[];
}

export interface GeneratedProposal {
  clientPersonality: ClientPersonality;
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string;
  scopeIn: string[];
  scopeOut: string[];
  deliverables: string[];
  assumptions: string[];
  risks: ScopeRisk[];
  timeline: TimelinePhase[];
  team: TeamRole[];
  architecture: ArchitectureRecommendation;
  pricing: PricingPackage[];
  recommendedPackage: string;
  recommendedPackageReason: string;
  roi: ROIForecast;
  competitorFeatures: string[];
  scopeCreep: ScopeCreepAssessment;
  completeness: CompletenessBreakdown;
  quality: QualityScore;
  dealProbability: DealProbability;
  missingInformation: string[];
  version: number;
}

export interface Proposal {
  id: string;
  createdAt: string;
  intake: IntakeState;
  document: GeneratedProposal;
}

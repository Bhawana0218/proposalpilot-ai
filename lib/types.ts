export type ClientPersonality =
  | "Startup Founder"
  | "Enterprise Client"
  | "Technical Founder"
  | "Non-Technical Business Owner";

export interface ClientInfo {
  companyName: string;
  industry: string;
  companySize: string;
  region: string;
  existingWebsite?: string;
  budgetRange: string;
  contactPerson: string;
  contactEmail?: string;
}

export interface BusinessGoals {
  selected: string[];
  freeText: string;
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

// ---- Discovery Intelligence ----

export interface DiscoveryCompleteness {
  businessClarity: number;
  technicalConfidence: number;
  scopeCompleteness: number;
  deliveryRisk: number;
}

export interface DiscoveryResult {
  questions: string[];
  completeness: DiscoveryCompleteness;
  consultantInsights: string[];
  riskFlags: string[];
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
  allocation: number;
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
  overall: number;
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
  operationalEfficiencyGainPct: string;
  narrative: string;
}

export interface DealProbability {
  probabilityPct: number;
  positiveFactors: string[];
  negativeFactors: string[];
}

export interface BudgetEstimate {
  teamSize: number;
  roles: { role: string; headcount: number }[];
  estimatedCostRange: string;
  deliveryDuration: string;
}

export interface WinProbability {
  probability: number;
  reasoning: string[];
}

export interface GeneratedProposal {
  clientPersonality: ClientPersonality;
  proposalScore: number;
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
  budgetEstimate: BudgetEstimate;
  winProbability: WinProbability;
  version: number;
}

export interface Proposal {
  id: string;
  createdAt: string;
  intake: IntakeState;
  document: GeneratedProposal;
}

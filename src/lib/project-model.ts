export type ProjectType = "residential" | "commercial" | "industrial" | "infrastructure";
export type MaterialType = "concrete" | "steel" | "timber" | "brick" | "mixed";

export interface ProjectDetails {
  name: string;
  type: ProjectType;
  location: string;
  areaSqFt: number;
  material: MaterialType;
  budget: number;
  startDate: Date;
}

export interface CostRow {
  category: string;
  unit: string;
  qty: number;
  unitCost: number;
  total: number;
}

export interface LaborRow {
  role: string;
  count: number;
  dailyRate: number;
  days: number;
  total: number;
}

export interface MaterialRow {
  item: string;
  qty: string;
  delivery: Date;
}

export interface EquipmentRow {
  name: string;
  rentalDays: number;
  dailyCost: number;
  total: number;
}

export interface TimelinePhase {
  name: string;
  startWeek: number;
  durationWeeks: number;
  critical: boolean;
  milestone: boolean;
}

export interface ResourcePlan {
  labor: LaborRow[];
  materials: MaterialRow[];
  equipment: EquipmentRow[];
  totalCost: number;
}

const BASE_RATE_PER_SQ_FT: Record<ProjectType, number> = {
  residential: 1900,
  commercial: 2400,
  industrial: 2100,
  infrastructure: 2800,
};

const MATERIAL_FACTOR: Record<MaterialType, number> = {
  concrete: 1,
  steel: 1.12,
  timber: 0.95,
  brick: 0.9,
  mixed: 1.03,
};

const COST_SPLITS = [
  { category: "Foundation", unit: "cu m", split: 0.14, qty: (area: number) => area * 0.025 },
  { category: "Structure", unit: "sq ft", split: 0.33, qty: (area: number) => area },
  { category: "Roofing", unit: "sq ft", split: 0.08, qty: (area: number) => area * 0.27 },
  { category: "Electrical", unit: "points", split: 0.06, qty: (area: number) => Math.max(80, area / 70) },
  { category: "Plumbing", unit: "points", split: 0.05, qty: (area: number) => Math.max(45, area / 130) },
  { category: "Interior Finishing", unit: "sq ft", split: 0.18, qty: (area: number) => area * 0.82 },
  { category: "Labor", unit: "man-days", split: 0.13, qty: (area: number) => area * 0.38 },
  { category: "Equipment", unit: "days", split: 0.03, qty: (area: number) => Math.max(40, area / 115) },
] as const;

export const defaultProjectDetails: ProjectDetails = {
  name: "Greenfield Residential Complex",
  type: "residential",
  location: "Mumbai, India",
  areaSqFt: 12000,
  material: "concrete",
  budget: 25000000,
  startDate: new Date(2025, 3, 1),
};

export function formatCurrencyINR(value: number) {
  return "₹" + Math.round(value).toLocaleString("en-IN");
}

export function calculateCostRows(project: ProjectDetails, contingencyPct = 10) {
  const base = project.areaSqFt * BASE_RATE_PER_SQ_FT[project.type] * MATERIAL_FACTOR[project.material];

  const rows: CostRow[] = COST_SPLITS.map((item) => {
    const qty = Math.max(1, Math.round(item.qty(project.areaSqFt)));
    const total = base * item.split;
    const unitCost = total / qty;

    return {
      category: item.category,
      unit: item.unit,
      qty,
      unitCost,
      total,
    };
  });

  const subtotal = rows.reduce((sum, row) => sum + row.total, 0);
  rows.push({
    category: `Contingency (${contingencyPct}%)`,
    unit: "-",
    qty: 1,
    unitCost: (subtotal * contingencyPct) / 100,
    total: (subtotal * contingencyPct) / 100,
  });

  return rows;
}

export function calculateConfidence(project: ProjectDetails, contingencyPct: number) {
  const areaPenalty = project.areaSqFt > 20000 ? 4 : project.areaSqFt > 15000 ? 2 : 0;
  const typeBonus = project.type === "residential" ? 2 : project.type === "commercial" ? 1 : 0;
  const materialBonus = project.material === "mixed" ? 1 : 0;
  const contingencyPenalty = Math.abs(contingencyPct - 10) * 0.4;

  const score = 90 + typeBonus + materialBonus - areaPenalty - contingencyPenalty;
  return Math.max(70, Math.min(97, Math.round(score)));
}

export function calculateResourcePlan(
  project: ProjectDetails,
  options: { crewMultiplier: number; accelerated: boolean },
): ResourcePlan {
  const scale = Math.max(0.5, project.areaSqFt / 12000);
  const durationFactor = options.accelerated ? 0.82 : 1;

  const labor: LaborRow[] = [
    {
      role: "Site Engineer",
      count: Math.max(1, Math.round(2 * scale * options.crewMultiplier)),
      dailyRate: 3500,
      days: Math.round(180 * scale * durationFactor),
      total: 0,
    },
    {
      role: "Project Manager",
      count: Math.max(1, Math.round(1 * scale)),
      dailyRate: 5000,
      days: Math.round(190 * scale * durationFactor),
      total: 0,
    },
    {
      role: "Skilled Workers",
      count: Math.max(6, Math.round(12 * scale * options.crewMultiplier)),
      dailyRate: 850,
      days: Math.round(160 * scale * durationFactor),
      total: 0,
    },
    {
      role: "Helpers",
      count: Math.max(10, Math.round(20 * scale * options.crewMultiplier)),
      dailyRate: 550,
      days: Math.round(160 * scale * durationFactor),
      total: 0,
    },
  ].map((row) => ({ ...row, total: row.count * row.dailyRate * row.days }));

  const start = project.startDate;
  const plusDays = (days: number) => new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

  const materials: MaterialRow[] = [
    { item: "Cement (bags)", qty: Math.round(project.areaSqFt * 0.35).toLocaleString("en-IN"), delivery: plusDays(14) },
    { item: "Steel Rods (tons)", qty: Math.round(project.areaSqFt * 0.0024).toLocaleString("en-IN"), delivery: plusDays(20) },
    { item: "Sand (cu m)", qty: Math.round(project.areaSqFt * 0.028).toLocaleString("en-IN"), delivery: plusDays(10) },
    { item: "Bricks", qty: Math.round(project.areaSqFt * 7.2).toLocaleString("en-IN"), delivery: plusDays(35) },
    { item: "Wiring (m)", qty: Math.round(project.areaSqFt * 0.54).toLocaleString("en-IN"), delivery: plusDays(75) },
  ];

  const equipment: EquipmentRow[] = [
    {
      name: "Tower Crane",
      rentalDays: Math.max(25, Math.round(90 * scale * durationFactor)),
      dailyCost: 8000,
      total: 0,
    },
    {
      name: "Concrete Mixer",
      rentalDays: Math.max(35, Math.round(120 * scale * durationFactor)),
      dailyCost: 2500,
      total: 0,
    },
    {
      name: "Excavator",
      rentalDays: Math.max(12, Math.round(30 * scale * durationFactor)),
      dailyCost: 6000,
      total: 0,
    },
  ].map((row) => ({ ...row, total: row.rentalDays * row.dailyCost }));

  const totalCost =
    labor.reduce((sum, row) => sum + row.total, 0) +
    equipment.reduce((sum, row) => sum + row.total, 0);

  return { labor, materials, equipment, totalCost };
}

export function calculateTimeline(project: ProjectDetails) {
  const complexityFactor =
    project.type === "infrastructure" ? 1.25 : project.type === "commercial" ? 1.12 : 1;
  const totalWeeks = Math.max(16, Math.round((project.areaSqFt / 800) * complexityFactor + 8));

  const phasesBlueprint = [
    { name: "Site Preparation", ratio: 0.12, critical: false, milestone: false },
    { name: "Foundation", ratio: 0.16, critical: true, milestone: true },
    { name: "Structure", ratio: 0.28, critical: true, milestone: false },
    { name: "MEP Works", ratio: 0.2, critical: true, milestone: false },
    { name: "Interior", ratio: 0.15, critical: false, milestone: true },
    { name: "Finishing", ratio: 0.07, critical: false, milestone: false },
    { name: "Handover", ratio: 0.02, critical: true, milestone: true },
  ] as const;

  let cursor = 0;
  const phases: TimelinePhase[] = phasesBlueprint.map((phase, index) => {
    const remaining = totalWeeks - cursor;
    const durationWeeks =
      index === phasesBlueprint.length - 1
        ? Math.max(1, remaining)
        : Math.max(1, Math.round(totalWeeks * phase.ratio));

    const result: TimelinePhase = {
      name: phase.name,
      startWeek: cursor,
      durationWeeks,
      critical: phase.critical,
      milestone: phase.milestone,
    };

    cursor += durationWeeks;
    return result;
  });

  return { phases, totalWeeks };
}

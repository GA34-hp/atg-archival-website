// components/content-icons.ts
// Icône de chaque élément de contenu (bibliothèque lucide-react, licence ISC).
// Choisies pour correspondre aux pictogrammes de l'affiche.
// "Record<ServiceKey, LucideIcon>" : une icône OBLIGATOIRE pour chaque clé de
// lib/content.ts — un service ajouté sans icône = erreur de compilation.

import {
  Archive,
  Award,
  Briefcase,
  ChartColumnIncreasing,
  CircleCheck,
  FileSearch,
  GraduationCap,
  HeartHandshake,
  Hospital,
  Landmark,
  Lock,
  MonitorCog,
  ScanLine,
  Scale,
  School,
  ShieldCheck,
  Target,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { PillarKey, SectorKey, ServiceKey, StrengthKey } from "@/lib/content";

export const serviceIcons: Record<ServiceKey, LucideIcon> = {
  audit: FileSearch,
  archiving: Archive,
  digitization: ScanLine,
  edm: MonitorCog,
  training: GraduationCap,
};

export const sectorIcons: Record<SectorKey, LucideIcon> = {
  banks: Landmark,
  insurance: ShieldCheck,
  hospitals: Hospital,
  education: School,
  companies: Briefcase,
  ngos: HeartHandshake,
  legal: Scale,
  publicAdmin: Landmark,
};

export const strengthIcons: Record<StrengthKey, LucideIcon> = {
  expertise: Users,
  confidentiality: ShieldCheck,
  tailored: Target,
  responsive: Timer,
  standards: Award,
};

export const pillarIcons: Record<PillarKey, LucideIcon> = {
  organise: Lock,
  secure: CircleCheck,
  enhance: ChartColumnIncreasing,
};
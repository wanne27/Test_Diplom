import { CandidateProjectResults } from './CandidateProjectResults';
import { CandidateLocation } from './CandidateLocation';
import { CandidateContact } from './CandidateContact';
import { PrimarySkill } from './Project';

export interface Candidate {
  id: string;
  name: string;
  surname: string;
  englishLevel: number;
  phoneNumber: string;
  email: string;
  bestTimeToConnect: number[];
  currentJob: string;
  goingToExadel: boolean;
  contacts: CandidateContact[];
  location: CandidateLocation;
  primarySkills: PrimarySkill[];
  registrationDate: Date | string;
  projectResults: CandidateProjectResults[];
  certificates?: string;
  additionalQuestions?: string;
  additionalInfo?: string;
  testResult?: string;
  projectLanguage: number;
}

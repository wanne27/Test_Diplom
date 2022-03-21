import { PrimarySkill } from 'src/app/shared/models/Project';
import { Feedback } from './Feedback';

export interface CandidateProjectResults {
  projectId: string;
  feedbacks: Feedback[];
  status: number;
  reason?: string | null;
  isAssigned?: boolean;
  primarySkill: { name: string; id: string };
}

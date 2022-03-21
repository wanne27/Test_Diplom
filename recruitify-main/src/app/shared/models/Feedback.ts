export interface Feedback {
  textFeedback?: string;
  rating?: number;
  userId?: string;
  userName?: string;
  type?: number;
  isRecommended?: boolean;
  createdOn?: Date | string;
  createdTime?: string;
}
export interface FeedbackTab extends Feedback {
  label: string;
  value: string;
}

export interface UserRoles {
  roles: (keyof typeof Role)[];
  projectId: string;
}

export enum Role {
  Admin,
  Manager,
  Recruiter,
  Interviewer,
  Mentor,
}

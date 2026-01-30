// Subject Types

export type SubjectStatus = "Enrolled" | "Active" | "Completed" | "Withdrawn";

export type Subject = {
  id: string;
  studyId: string;
  subjectNumber: string;
  initials?: string;
  enrollmentDate: string;
  status: SubjectStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateSubjectInput = {
  subjectNumber: string;
  initials?: string;
  enrollmentDate: string;
  status?: SubjectStatus;
};

export type UpdateSubjectInput = Partial<CreateSubjectInput>;

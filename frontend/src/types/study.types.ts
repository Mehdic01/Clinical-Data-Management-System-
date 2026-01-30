// Study Types

export type StudyStatus = "Draft" | "Active";

export type Study = {
  id: string;
  name: string;
  protocolCode: string;
  status: StudyStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateStudyInput = {
  name: string;
  protocolCode: string;
  status: StudyStatus;
};

export type UpdateStudyInput = Partial<CreateStudyInput>;

// Subject Types

export type Subject = {
  id: number;
  studyId: number;
  subjectIdentifier: string;
  enrollmentDate: string;
  scheduleGenerated: boolean;
};

export type SubjectScheduledVisit = {
  id: number;
  subjectId: number;
  visitTemplateId: number;
  scheduledDate: string;
  windowStart: string;
  windowEnd: string;
  status: "Pending" | "Done";
};

export type SubjectDetail = Subject & {
  scheduledVisits: SubjectScheduledVisit[];
};

export type CreateSubjectInput = {
  subjectIdentifier: string;
  enrollmentDate: string;
};

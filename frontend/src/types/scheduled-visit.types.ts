// Scheduled Visit Types

export type ScheduledVisitStatus = "Scheduled" | "Completed" | "Missed" | "Cancelled";

export type ScheduledVisit = {
  id: string;
  subjectId: string;
  visitTemplateId: string;
  scheduledDate: string;
  actualDate?: string;
  status: ScheduledVisitStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateScheduledVisitInput = {
  visitTemplateId: string;
  scheduledDate: string;
  notes?: string;
};

export type UpdateScheduledVisitInput = {
  scheduledDate?: string;
  actualDate?: string;
  status?: ScheduledVisitStatus;
  notes?: string;
};

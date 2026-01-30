// App-wide constants

export const APP_NAME = "CDMS";
export const APP_FULL_NAME = "Clinical Data Management System";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Status options
export const STUDY_STATUSES = ["Draft", "Active"] as const;
export const SUBJECT_STATUSES = ["Enrolled", "Active", "Completed", "Withdrawn"] as const;
export const VISIT_STATUSES = ["Scheduled", "Completed", "Missed", "Cancelled"] as const;
export const FORM_ENTRY_STATUSES = ["Draft", "Complete", "Verified"] as const;

// Field types (matches backend FieldType enum)
export const FIELD_TYPES = [
  { value: "Text", label: "Text" },
  { value: "Number", label: "Number" },
  { value: "Date", label: "Date" },
] as const;

// Query keys for React Query
export const QUERY_KEYS = {
  studies: ["studies"] as const,
  study: (id: string) => ["studies", id] as const,
  visitTemplates: (studyId: string) => ["studies", studyId, "visitTemplates"] as const,
  visitTemplate: (studyId: string, id: string) => ["studies", studyId, "visitTemplates", id] as const,
  formTemplates: (studyId: string) => ["studies", studyId, "formTemplates"] as const,
  formTemplate: (studyId: string, id: string) => ["studies", studyId, "formTemplates", id] as const,
  subjects: (studyId: string) => ["studies", studyId, "subjects"] as const,
  subject: (studyId: string, id: string) => ["studies", studyId, "subjects", id] as const,
  scheduledVisits: (subjectId: string) => ["subjects", subjectId, "scheduledVisits"] as const,
  scheduledVisit: (id: string) => ["scheduledVisits", id] as const,
  formEntries: (scheduledVisitId: string) => ["scheduledVisits", scheduledVisitId, "formEntries"] as const,
  formEntry: (id: string) => ["formEntries", id] as const,
} as const;

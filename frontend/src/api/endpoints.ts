// API endpoint constants
// Centralized endpoint definitions for easy maintenance

export const ENDPOINTS = {
  // Studies
  STUDIES: "/studies",
  STUDY: (id: string) => `/studies/${id}`,

  // Visit Templates
  VISIT_TEMPLATES: (studyId: string) => `/studies/${studyId}/visit-templates`,
  VISIT_TEMPLATE: (studyId: string, id: string) => `/studies/${studyId}/visit-templates/${id}`,
  VISIT_TEMPLATE_ATTACHED_FORMS: (studyId: string, id: string) => `/studies/${studyId}/visit-templates/${id}/attached-forms`,

  // Form Templates
  FORM_TEMPLATES: (studyId: string) => `/studies/${studyId}/form-templates`,
  FORM_TEMPLATE: (studyId: string, id: string) => `/studies/${studyId}/form-templates/${id}`,
  FORM_TEMPLATE_FIELD_COUNT: (studyId: string, id: string) => `/studies/${studyId}/form-templates/${id}/field-count`,

  // Subjects
  SUBJECTS: (studyId: string) => `/studies/${studyId}/subjects`,
  SUBJECT: (id: string) => `/subjects/${id}`,
  GENERATE_SCHEDULE: (subjectId: string) => `/subjects/${subjectId}/scheduled-visits`,

  // Scheduled Visits
  SCHEDULED_VISITS: (subjectId: string) => `/subjects/${subjectId}/scheduled-visits`,
  SCHEDULED_VISIT: (id: string) => `/scheduled-visits/${id}`,
  SCHEDULED_VISIT_FORMS: (scheduledVisitId: string) => `/scheduled-visits/${scheduledVisitId}/forms`,

  // Form Entries
  FORM_ENTRIES: (scheduledVisitId: string) => `/scheduled-visits/${scheduledVisitId}/form-entries`,
  FORM_ENTRY: (id: string) => `/form-entries/${id}`,
} as const;

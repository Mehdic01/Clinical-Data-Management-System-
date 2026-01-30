import { z } from "zod";

// Study validation schemas
export const studySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  protocolCode: z.string().min(2, "Protocol code must be at least 2 characters"),
  status: z.enum(["Draft", "Active"]),
});

export type StudyFormValues = z.infer<typeof studySchema>;

// Visit Template validation schemas
export const visitTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(64),
  day: z.number().int().min(0, "Day must be 0 or greater"),
  windowBefore: z.number().int().min(0, "Must be 0 or greater"),
  windowAfter: z.number().int().min(0, "Must be 0 or greater"),
});

export type VisitTemplateFormValues = z.infer<typeof visitTemplateSchema>;

// Form Template validation schemas
export const formFieldSchema = z.object({
  label: z.string().min(1, "Label is required").max(200),
  key: z.string().min(1, "Key is required").max(64),
  type: z.enum(["Text", "Number", "Date"]),
  required: z.boolean(),
  order: z.number().int().min(0),
});

export const formTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(64),
  fields: z.array(formFieldSchema).optional(),
});

export type FormFieldFormValues = z.infer<typeof formFieldSchema>;
export type FormTemplateFormValues = z.infer<typeof formTemplateSchema>;

// Subject validation schemas
export const subjectSchema = z.object({
  subjectNumber: z.string().min(1, "Subject number is required"),
  initials: z.string().max(4, "Initials must be 4 characters or less").optional(),
  enrollmentDate: z.string().min(1, "Enrollment date is required"),
  status: z.enum(["Enrolled", "Active", "Completed", "Withdrawn"]).optional(),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

// Scheduled Visit validation schemas
export const scheduledVisitSchema = z.object({
  visitTemplateId: z.string().min(1, "Visit template is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  notes: z.string().optional(),
});

export type ScheduledVisitFormValues = z.infer<typeof scheduledVisitSchema>;

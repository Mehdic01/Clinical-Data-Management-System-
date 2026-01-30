// Form Entry Types

export type FormEntryStatus = "Draft" | "Submitted";

export type FieldValueInput = {
  fieldId: number;
  value: string;
};

export type FieldValueOut = {
  id: number;
  fieldId: number;
  value: string;
};

export type FormEntry = {
  id: number;
  scheduledVisitId: number;
  formTemplateId: number;
  status: FormEntryStatus;
  submittedAt: string | null;
  createdAt: string;
};

export type FormEntryDetail = FormEntry & {
  fieldValues: FieldValueOut[];
};

// Scheduled visit için form listesi
export type ScheduledVisitForm = {
  formTemplateId: number;
  name: string;
  code: string;
  fieldCount: number;
  entry: FormEntry | null; // Doldurulmuşsa entry bilgisi, yoksa null
};

export type CreateFormEntryInput = {
  formTemplateId: number;
  fieldValues: FieldValueInput[];
};

export type UpdateFormEntryInput = {
  status?: FormEntryStatus;
  fieldValues?: FieldValueInput[];
};

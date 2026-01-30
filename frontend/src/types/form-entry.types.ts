// Form Entry Types

export type FormEntryStatus = "Draft" | "Complete" | "Verified";

export type FormEntryValue = {
  fieldId: string;
  value: string | number | boolean | null;
};

export type FormEntry = {
  id: string;
  scheduledVisitId: string;
  formTemplateId: string;
  status: FormEntryStatus;
  values: FormEntryValue[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateFormEntryInput = {
  formTemplateId: string;
  values?: FormEntryValue[];
};

export type UpdateFormEntryInput = {
  status?: FormEntryStatus;
  values?: FormEntryValue[];
};

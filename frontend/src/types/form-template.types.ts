// Form Template Types

// Backend FieldType enum ile uyumlu
export type FieldType = "Text" | "Number" | "Date";

export type FormField = {
  id: number;
  formTemplateId: number;
  label: string;
  key: string; // unique within the form
  type: FieldType;
  required: boolean;
  order: number;
};

export type FormTemplate = {
  id: number;
  studyId: number;
  name: string;
  code: string; // unique within study
  fields?: FormField[];
};

// Visit Template - Form Template ilişkisi (join table)
export type VisitTemplateForm = {
  id: number;
  visitTemplateId: number;
  formTemplateId: number;
};

export type CreateFormFieldInput = {
  label: string;
  key: string;
  type: FieldType;
  required: boolean;
  order: number;
};

export type CreateFormTemplateInput = {
  name: string;
  code: string;
  fields?: CreateFormFieldInput[];
};

export type UpdateFormTemplateInput = Partial<CreateFormTemplateInput>;

export type UpdateFormFieldInput = Partial<CreateFormFieldInput>;

// Visit Template Types

export type VisitTemplate = {
  id: number;
  studyId: number;
  name: string;
  code: string;
  day: number;
  windowBefore: number;
  windowAfter: number;
};

export type AttachedForm = {
  id: number;
  name: string;
  code: string;
};

export type VisitTemplateWithForms = VisitTemplate & {
  attachedForms: AttachedForm[];
};

export type CreateVisitTemplateInput = {
  name: string;
  code: string;
  day: number;
  windowBefore: number;
  windowAfter: number;
};

export type UpdateVisitTemplateInput = Partial<CreateVisitTemplateInput>;

import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  VisitTemplate,
  VisitTemplateWithForms,
  CreateVisitTemplateInput,
  UpdateVisitTemplateInput,
} from "@/types/visit-template.types";

export const visitTemplateService = {
  list: async (studyId: string): Promise<VisitTemplate[]> => {
    const res = await api.get(ENDPOINTS.VISIT_TEMPLATES(studyId));
    return res.data;
  },

  getById: async (studyId: string, id: string): Promise<VisitTemplateWithForms> => {
    const res = await api.get(ENDPOINTS.VISIT_TEMPLATE(studyId, id));
    return res.data;
  },

  create: async (studyId: string, input: CreateVisitTemplateInput): Promise<VisitTemplate> => {
    const res = await api.post(ENDPOINTS.VISIT_TEMPLATES(studyId), input);
    return res.data;
  },

  update: async (studyId: string, id: string, input: UpdateVisitTemplateInput): Promise<VisitTemplate> => {
    const res = await api.put(ENDPOINTS.VISIT_TEMPLATE(studyId, id), input);
    return res.data;
  },

  delete: async (studyId: string, id: string): Promise<void> => {
    await api.delete(ENDPOINTS.VISIT_TEMPLATE(studyId, id));
  },

  // Attached forms
  replaceAttachedForms: async (studyId: string, id: string, formTemplateIds: number[]): Promise<void> => {
    await api.put(ENDPOINTS.VISIT_TEMPLATE_ATTACHED_FORMS(studyId, id), { formTemplateIds });
  },
};

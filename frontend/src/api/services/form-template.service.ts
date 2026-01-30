import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  FormTemplate,
  CreateFormTemplateInput,
  UpdateFormTemplateInput,
} from "@/types/form-template.types";

export const formTemplateService = {
  list: async (studyId: string): Promise<FormTemplate[]> => {
    const res = await api.get(ENDPOINTS.FORM_TEMPLATES(studyId));
    return res.data;
  },

  getById: async (studyId: string, id: string): Promise<FormTemplate> => {
    const res = await api.get(ENDPOINTS.FORM_TEMPLATE(studyId, id));
    return res.data;
  },

  getFieldCount: async (studyId: string, id: string): Promise<{ count: number }> => {
    const res = await api.get(ENDPOINTS.FORM_TEMPLATE_FIELD_COUNT(studyId, id));
    return res.data;
  },

  create: async (studyId: string, input: CreateFormTemplateInput): Promise<FormTemplate> => {
    const res = await api.post(ENDPOINTS.FORM_TEMPLATES(studyId), input);
    return res.data;
  },

  update: async (studyId: string, id: string, input: UpdateFormTemplateInput): Promise<FormTemplate> => {
    const res = await api.put(ENDPOINTS.FORM_TEMPLATE(studyId, id), input);
    return res.data;
  },

  delete: async (studyId: string, id: string): Promise<void> => {
    await api.delete(ENDPOINTS.FORM_TEMPLATE(studyId, id));
  },
};

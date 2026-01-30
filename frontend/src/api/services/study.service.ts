import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { Study, CreateStudyInput, UpdateStudyInput } from "@/types/study.types";

export const studyService = {
  list: async (): Promise<Study[]> => {
    const res = await api.get(ENDPOINTS.STUDIES);
    return res.data;
  },

  getById: async (id: string): Promise<Study> => {
    const res = await api.get(ENDPOINTS.STUDY(id));
    return res.data;
  },

  create: async (input: CreateStudyInput): Promise<Study> => {
    const res = await api.post(ENDPOINTS.STUDIES, input);
    return res.data;
  },

  update: async (id: string, input: UpdateStudyInput): Promise<Study> => {
    const res = await api.put(ENDPOINTS.STUDY(id), input);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.STUDY(id));
  },
};

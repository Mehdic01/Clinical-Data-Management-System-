import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { Subject, CreateSubjectInput, UpdateSubjectInput } from "@/types/subject.types";

export const subjectService = {
  list: async (studyId: string): Promise<Subject[]> => {
    const res = await api.get(ENDPOINTS.SUBJECTS(studyId));
    return res.data;
  },

  getById: async (studyId: string, id: string): Promise<Subject> => {
    const res = await api.get(ENDPOINTS.SUBJECT(studyId, id));
    return res.data;
  },

  create: async (studyId: string, input: CreateSubjectInput): Promise<Subject> => {
    const res = await api.post(ENDPOINTS.SUBJECTS(studyId), input);
    return res.data;
  },

  update: async (studyId: string, id: string, input: UpdateSubjectInput): Promise<Subject> => {
    const res = await api.put(ENDPOINTS.SUBJECT(studyId, id), input);
    return res.data;
  },

  delete: async (studyId: string, id: string): Promise<void> => {
    await api.delete(ENDPOINTS.SUBJECT(studyId, id));
  },
};

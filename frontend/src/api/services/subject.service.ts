import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { Subject, SubjectDetail, CreateSubjectInput, SubjectScheduledVisit } from "@/types/subject.types";

export const subjectService = {
  list: async (studyId: string): Promise<Subject[]> => {
    const res = await api.get(ENDPOINTS.SUBJECTS(studyId));
    return res.data;
  },

  getById: async (id: string): Promise<SubjectDetail> => {
    const res = await api.get(ENDPOINTS.SUBJECT(id));
    return res.data;
  },

  create: async (studyId: string, input: CreateSubjectInput): Promise<Subject> => {
    const res = await api.post(ENDPOINTS.SUBJECTS(studyId), input);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.SUBJECT(id));
  },

  generateSchedule: async (subjectId: string): Promise<SubjectScheduledVisit[]> => {
    const res = await api.post(ENDPOINTS.GENERATE_SCHEDULE(subjectId));
    return res.data;
  },
};

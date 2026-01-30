import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  ScheduledVisit,
  CreateScheduledVisitInput,
  UpdateScheduledVisitInput,
} from "@/types/scheduled-visit.types";

export const scheduledVisitService = {
  list: async (subjectId: string): Promise<ScheduledVisit[]> => {
    const res = await api.get(ENDPOINTS.SCHEDULED_VISITS(subjectId));
    return res.data;
  },

  getById: async (id: string): Promise<ScheduledVisit> => {
    const res = await api.get(ENDPOINTS.SCHEDULED_VISIT(id));
    return res.data;
  },

  create: async (subjectId: string, input: CreateScheduledVisitInput): Promise<ScheduledVisit> => {
    const res = await api.post(ENDPOINTS.SCHEDULED_VISITS(subjectId), input);
    return res.data;
  },

  update: async (id: string, input: UpdateScheduledVisitInput): Promise<ScheduledVisit> => {
    const res = await api.put(ENDPOINTS.SCHEDULED_VISIT(id), input);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.SCHEDULED_VISIT(id));
  },
};

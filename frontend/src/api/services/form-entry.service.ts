import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  FormEntry,
  CreateFormEntryInput,
  UpdateFormEntryInput,
} from "@/types/form-entry.types";

export const formEntryService = {
  list: async (scheduledVisitId: string): Promise<FormEntry[]> => {
    const res = await api.get(ENDPOINTS.FORM_ENTRIES(scheduledVisitId));
    return res.data;
  },

  getById: async (id: string): Promise<FormEntry> => {
    const res = await api.get(ENDPOINTS.FORM_ENTRY(id));
    return res.data;
  },

  create: async (scheduledVisitId: string, input: CreateFormEntryInput): Promise<FormEntry> => {
    const res = await api.post(ENDPOINTS.FORM_ENTRIES(scheduledVisitId), input);
    return res.data;
  },

  update: async (id: string, input: UpdateFormEntryInput): Promise<FormEntry> => {
    const res = await api.put(ENDPOINTS.FORM_ENTRY(id), input);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.FORM_ENTRY(id));
  },
};

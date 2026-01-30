import { api } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  FormEntryDetail,
  CreateFormEntryInput,
  ScheduledVisitForm,
} from "@/types/form-entry.types";

export const formEntryService = {
  // GET: Scheduled visit için bağlı formları ve doldurulma durumlarını getirir
  getScheduledVisitForms: async (scheduledVisitId: string): Promise<ScheduledVisitForm[]> => {
    const res = await api.get(ENDPOINTS.SCHEDULED_VISIT_FORMS(scheduledVisitId));
    return res.data;
  },

  // GET: Tek bir form entry detayını getirir
  getById: async (id: string): Promise<FormEntryDetail> => {
    const res = await api.get(ENDPOINTS.FORM_ENTRY(id));
    return res.data;
  },

  // POST: Yeni form entry oluşturur (form doldurma)
  create: async (scheduledVisitId: string, input: CreateFormEntryInput): Promise<FormEntryDetail> => {
    const res = await api.post(ENDPOINTS.FORM_ENTRIES(scheduledVisitId), input);
    return res.data;
  },
};

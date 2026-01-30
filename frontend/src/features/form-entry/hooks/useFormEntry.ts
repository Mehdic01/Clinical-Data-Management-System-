import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formEntryService } from "@/api/services/form-entry.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateFormEntryInput } from "@/types/form-entry.types";

// Scheduled visit için bağlı formları ve doldurulma durumlarını getirir
export function useScheduledVisitForms(scheduledVisitId: string) {
  return useQuery({
    queryKey: ["scheduledVisitForms", scheduledVisitId],
    queryFn: () => formEntryService.getScheduledVisitForms(scheduledVisitId),
    enabled: !!scheduledVisitId,
  });
}

// Tek bir form entry detayını getirir
export function useFormEntry(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.formEntry(id),
    queryFn: () => formEntryService.getById(id),
    enabled: !!id,
  });
}

// Yeni form entry oluşturur
export function useCreateFormEntry(scheduledVisitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFormEntryInput) =>
      formEntryService.create(scheduledVisitId, input),
    onSuccess: () => {
      // Form listesini güncelle
      queryClient.invalidateQueries({
        queryKey: ["scheduledVisitForms", scheduledVisitId],
      });
      // Subject detayını da güncelle (visit status değişebilir)
      queryClient.invalidateQueries({
        queryKey: ["subject"],
      });
    },
  });
}

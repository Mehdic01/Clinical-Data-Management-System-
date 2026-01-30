import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formEntryService } from "@/api/services/form-entry.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateFormEntryInput, UpdateFormEntryInput } from "@/types/form-entry.types";

export function useFormEntries(scheduledVisitId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.formEntries(scheduledVisitId),
    queryFn: () => formEntryService.list(scheduledVisitId),
    enabled: !!scheduledVisitId,
  });
}

export function useFormEntry(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.formEntry(id),
    queryFn: () => formEntryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateFormEntry(scheduledVisitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFormEntryInput) =>
      formEntryService.create(scheduledVisitId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.formEntries(scheduledVisitId),
      });
    },
  });
}

export function useUpdateFormEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFormEntryInput }) =>
      formEntryService.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.formEntry(id) });
    },
  });
}

export function useDeleteFormEntry(scheduledVisitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => formEntryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.formEntries(scheduledVisitId),
      });
    },
  });
}

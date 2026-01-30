import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitTemplateService } from "@/api/services/visit-template.service";
import { QUERY_KEYS } from "@/lib/constants";
import type {
  CreateVisitTemplateInput,
  UpdateVisitTemplateInput,
} from "@/types/visit-template.types";

export function useVisitTemplates(studyId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.visitTemplates(studyId),
    queryFn: () => visitTemplateService.list(studyId),
    enabled: !!studyId,
  });
}

export function useVisitTemplate(studyId: string, id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.visitTemplate(studyId, id),
    queryFn: () => visitTemplateService.getById(studyId, id),
    enabled: !!studyId && !!id,
  });
}

export function useCreateVisitTemplate(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVisitTemplateInput) =>
      visitTemplateService.create(studyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.visitTemplates(studyId),
      });
    },
  });
}

export function useUpdateVisitTemplate(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVisitTemplateInput }) =>
      visitTemplateService.update(studyId, id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.visitTemplates(studyId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.visitTemplate(studyId, id),
      });
    },
  });
}

export function useDeleteVisitTemplate(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => visitTemplateService.delete(studyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.visitTemplates(studyId),
      });
    },
  });
}

export function useReplaceAttachedForms(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formTemplateIds }: { id: string; formTemplateIds: number[] }) =>
      visitTemplateService.replaceAttachedForms(studyId, id, formTemplateIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.visitTemplate(studyId, id),
      });
    },
  });
}

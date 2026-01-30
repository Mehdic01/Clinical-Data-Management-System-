import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formTemplateService } from "@/api/services/form-template.service";
import { QUERY_KEYS } from "@/lib/constants";
import type {
  CreateFormTemplateInput,
  UpdateFormTemplateInput,
} from "@/types/form-template.types";

export function useFormTemplates(studyId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.formTemplates(studyId),
    queryFn: () => formTemplateService.list(studyId),
    enabled: !!studyId,
  });
}

export function useFormTemplate(studyId: string, id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.formTemplate(studyId, id),
    queryFn: () => formTemplateService.getById(studyId, id),
    enabled: !!studyId && !!id,
  });
}

export function useFormTemplateFieldCount(studyId: string, id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.formTemplate(studyId, id), "field-count"],
    queryFn: () => formTemplateService.getFieldCount(studyId, id),
    enabled: !!studyId && !!id,
  });
}

export function useCreateFormTemplate(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFormTemplateInput) =>
      formTemplateService.create(studyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.formTemplates(studyId),
      });
    },
  });
}

export function useUpdateFormTemplate(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFormTemplateInput }) =>
      formTemplateService.update(studyId, id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.formTemplates(studyId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.formTemplate(studyId, id),
      });
    },
  });
}

export function useDeleteFormTemplate(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => formTemplateService.delete(studyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.formTemplates(studyId),
      });
    },
  });
}

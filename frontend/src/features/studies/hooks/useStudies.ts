import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studyService } from "@/api/services/study.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateStudyInput, UpdateStudyInput } from "@/types/study.types";

export function useStudies() {
  return useQuery({
    queryKey: QUERY_KEYS.studies,
    queryFn: studyService.list,
  });
}

export function useStudy(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.study(id),
    queryFn: () => studyService.getById(id),
    enabled: !!id,
  });
}

export function useCreateStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStudyInput) => studyService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies });
    },
  });
}

export function useUpdateStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStudyInput }) =>
      studyService.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.study(id) });
    },
  });
}

export function useDeleteStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies });
    },
  });
}

export function useActivateStudy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studyService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.studies });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.study(id) });
    },
  });
}

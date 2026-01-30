import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "@/api/services/subject.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateSubjectInput } from "@/types/subject.types";

export function useSubjects(studyId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.subjects(studyId),
    queryFn: () => subjectService.list(studyId),
    enabled: !!studyId,
  });
}

export function useSubject(id: string) {
  return useQuery({
    queryKey: ["subject", id],
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSubject(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSubjectInput) => subjectService.create(studyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects(studyId) });
    },
  });
}

export function useDeleteSubject(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects(studyId) });
    },
  });
}

export function useGenerateSchedule(subjectId: string, studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subjectService.generateSchedule(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject", subjectId] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects(studyId) });
    },
  });
}

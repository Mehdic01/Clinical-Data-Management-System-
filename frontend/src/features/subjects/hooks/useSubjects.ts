import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "@/api/services/subject.service";
import { QUERY_KEYS } from "@/lib/constants";
import type { CreateSubjectInput, UpdateSubjectInput } from "@/types/subject.types";

export function useSubjects(studyId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.subjects(studyId),
    queryFn: () => subjectService.list(studyId),
    enabled: !!studyId,
  });
}

export function useSubject(studyId: string, id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.subject(studyId, id),
    queryFn: () => subjectService.getById(studyId, id),
    enabled: !!studyId && !!id,
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

export function useUpdateSubject(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSubjectInput }) =>
      subjectService.update(studyId, id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects(studyId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subject(studyId, id) });
    },
  });
}

export function useDeleteSubject(studyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subjectService.delete(studyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subjects(studyId) });
    },
  });
}

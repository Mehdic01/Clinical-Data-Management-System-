import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { SubjectList } from "../components/SubjectList";
import { useSubjects } from "../hooks/useSubjects";
import { toApiError } from "@/api/axios";

export function SubjectsPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const { data, isLoading, isError, error, refetch } = useSubjects(studyId!);

  if (isError) {
    const e = toApiError(error);
    return (
      <ErrorMessage
        title="Failed to load subjects"
        message={e.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button>Enroll Subject</Button>
      </div>
      <SubjectList subjects={data ?? []} studyId={studyId!} loading={isLoading} />
    </div>
  );
}

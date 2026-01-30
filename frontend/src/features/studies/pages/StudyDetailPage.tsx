import { useParams, NavLink, Outlet, useLocation } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { StudyStatusBadge } from "../components/StudyStatusBadge";
import { useStudy } from "../hooks/useStudies";
import { toApiError } from "@/api/axios";

export function StudyDetailPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const location = useLocation();
  const { data: study, isLoading, isError, error, refetch } = useStudy(studyId!);
  
  // Check if we're on a nested route (not just /studies/:studyId)
  const isNestedRoute = location.pathname !== `/studies/${studyId}`;

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading study..." />
      </PageContainer>
    );
  }

  if (isError) {
    const e = toApiError(error);
    return (
      <PageContainer>
        <ErrorMessage
          title="Failed to load study"
          message={e.message}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  if (!study) {
    return (
      <PageContainer>
        <ErrorMessage title="Study not found" />
      </PageContainer>
    );
  }

  const linkBase =
    "px-3 py-2 text-sm font-medium transition hover:text-black border-b-2 border-transparent";
  const linkActive = "text-black border-black";

  return (
    <PageContainer
      title={study.name}
      description={`Protocol: ${study.protocolCode}`}
      actions={<StudyStatusBadge status={study.status} />}
    >
      <nav className="mb-6 flex gap-4 border-b border-zinc-200">
        <NavLink
          to={`/studies/${studyId}/visit-templates`}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : "text-zinc-500"}`}
        >
          Visit Templates
        </NavLink>
        <NavLink
          to={`/studies/${studyId}/form-templates`}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : "text-zinc-500"}`}
        >
          Form Templates
        </NavLink>
        <NavLink
          to={`/studies/${studyId}/subjects`}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : "text-zinc-500"}`}
        >
          Subjects
        </NavLink>
      </nav>

      <Outlet />

      {/* Placeholder when no nested route is active */}
      {!isNestedRoute && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
          Select a tab above to view details.
        </div>
      )}
    </PageContainer>
  );
}

/**
 * StudyDetailPage
 * Seçilen çalışmanın detaylarını ve alt modül sekmelerini gösterir.
 * Çalışma bilgisini çeker, sekme yönlendirmelerini ve erişim akışını yönetir.
 */
import { useParams, NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useStudy } from "../hooks/useStudies";
import { toApiError } from "@/api/axios";

export function StudyDetailPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const location = useLocation();
  const { data: study, isLoading, isError, error, refetch } = useStudy(studyId!);
  
  // Check if we're on the base route (not a nested route)
  const isBaseRoute = location.pathname === `/studies/${studyId}`;

  // Redirect to visit-templates if on base route
  if (isBaseRoute && !isLoading && study) {
    return <Navigate to={`/studies/${studyId}/visit-templates`} replace />;
  }

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

  const isActive = study.status === "Active";

  return (
    <PageContainer title="" actions={null}>
      {/* Custom Header - Centered */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-slate-800">{study.name}</h1>
          <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
            isActive 
              ? "bg-green-100 text-green-700" 
              : "bg-slate-100 text-slate-600"
          }`}>
            {study.status}
          </span>
        </div>
        <p className="mt-2 text-lg text-slate-500">Protocol Code: {study.protocolCode}</p>
      </div>

      {/* Tabs */}
      <nav className="mb-8 flex justify-center gap-2">
        <NavLink
          to={`/studies/${studyId}/visit-templates`}
          className={({ isActive }) =>
            `rounded-lg px-6 py-3 text-base font-semibold transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
            }`
          }
        >
          Visit Templates
        </NavLink>
        <NavLink
          to={`/studies/${studyId}/form-templates`}
          className={({ isActive }) =>
            `rounded-lg px-6 py-3 text-base font-semibold transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
            }`
          }
        >
          Form Templates
        </NavLink>
        <NavLink
          to={`/studies/${studyId}/subjects`}
          className={({ isActive }) =>
            `rounded-lg px-6 py-3 text-base font-semibold transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
            }`
          }
        >
          Subjects
        </NavLink>
      </nav>

      <Outlet />
    </PageContainer>
  );
}

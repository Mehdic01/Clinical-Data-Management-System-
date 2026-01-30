import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Feature pages
import { StudiesPage } from "@/features/studies/pages/StudiesPage";
import { StudyDetailPage } from "@/features/studies/pages/StudyDetailPage";
import { VisitTemplatesPage } from "@/features/visit-templates/pages/VisitTemplatesPage";
import { FormTemplatesPage } from "@/features/form-templates/pages/FormTemplatesPage";
import { FormBuilderPage } from "@/features/form-templates/pages/FormBuilderPage";

// Dashboard placeholder
function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-zinc-500">Welcome to the Clinical Data Management System</p>
    </div>
  );
}

// Bu router sınıfı sayesinde uygulamanın farklı sayfalarına yönlendirme yapılabilir. ve her sayfa için hangi bileşenin render edileceği belirlenir.
//************************************************************************************************************************************************* */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      
      // Studies
      { path: "/studies", element: <StudiesPage /> },
      { 
        path: "/studies/:studyId", 
        element: <StudyDetailPage />,
        children: [
          { path: "visit-templates", element: <VisitTemplatesPage /> },
          { path: "form-templates", element: <FormTemplatesPage /> },
          { path: "form-templates/:formTemplateId/edit", element: <FormBuilderPage /> },
          // { path: "subjects", element: <SubjectsPage /> },
        ],
      },

      // TODO: Add more routes as features are built
      // Subjects detail
      // { path: "/studies/:studyId/subjects/:subjectId", element: <SubjectDetailPage /> },
      
      // Form Entry
      // { path: "/scheduled-visits/:scheduledVisitId", element: <FormEntryPage /> },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

// Feature pages
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { StudiesPage } from "@/features/studies/pages/StudiesPage";
import { StudyDetailPage } from "@/features/studies/pages/StudyDetailPage";
import { VisitTemplatesPage } from "@/features/visit-templates/pages/VisitTemplatesPage";
import { FormTemplatesPage } from "@/features/form-templates/pages/FormTemplatesPage";
import { FormBuilderPage } from "@/features/form-templates/pages/FormBuilderPage";
import { SubjectsPage } from "@/features/subjects/pages/SubjectsPage";
import { SubjectDetailPage } from "@/features/subjects/pages/SubjectDetailPage";

// Bu router sınıfı sayesinde uygulamanın farklı sayfalarına yönlendirme yapılabilir. ve her sayfa için hangi bileşenin render edileceği belirlenir.
//************************************************************************************************************************************************* */
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      
      // Studies
      { path: "/studies", element: <StudiesPage /> },
      { 
        path: "/studies/:studyId", 
        element: <StudyDetailPage />,
        children: [
          { path: "subjects", element: <SubjectsPage /> },
          { path: "subjects/:subjectId", element: <SubjectDetailPage /> },
          { path: "visit-templates", element: <VisitTemplatesPage /> },
          { path: "form-templates", element: <FormTemplatesPage /> },
          { path: "form-templates/:formTemplateId/edit", element: <FormBuilderPage /> },
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

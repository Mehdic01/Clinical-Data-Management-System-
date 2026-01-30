import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { FormBuilder } from "../components/FormBuilder";
import { useCreateFormTemplate } from "../hooks/useFormTemplates";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { toApiError } from "@/api/axios";
import type { FormTemplateFormValues } from "@/lib/validation";

export function FormBuilderPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const createMutation = useCreateFormTemplate(studyId!);

  const handleSubmit = async (values: FormTemplateFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      navigate(`/studies/${studyId}/form-templates`);
    } catch (err) {
      // Error handled by mutation state
    }
  };

  return (
    <PageContainer title="Create Form Template">
      <FormBuilder
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        loading={createMutation.isPending}
      />
      {createMutation.isError && (
        <div className="mt-4">
          <ErrorMessage
            title="Failed to create form template"
            message={toApiError(createMutation.error).message}
          />
        </div>
      )}
    </PageContainer>
  );
}

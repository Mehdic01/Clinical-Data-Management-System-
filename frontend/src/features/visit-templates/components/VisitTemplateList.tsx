import type { VisitTemplate } from "@/types/visit-template.types";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";

type VisitTemplateListProps = {
  visitTemplates: VisitTemplate[];
  loading?: boolean;
  onSelect?: (visitTemplate: VisitTemplate) => void;
  onEdit?: (visitTemplate: VisitTemplate) => void;
  onDelete?: (visitTemplate: VisitTemplate) => void;
  onManageForms?: (visitTemplate: VisitTemplate) => void;
};

export function VisitTemplateList({
  visitTemplates,
  loading,
  onSelect,
  onEdit,
  onDelete,
  onManageForms,
}: VisitTemplateListProps) {
  const columns = [
    { key: "code", header: "Code", className: "w-24" },
    { key: "name", header: "Name" },
    { key: "day", header: "Day", className: "w-20" },
    {
      key: "window",
      header: "Window",
      render: (vt: VisitTemplate) => {
        if (vt.windowBefore || vt.windowAfter) {
          return `${vt.windowBefore} days before / ${vt.windowAfter} days after`;
        }
        return "—";
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-48",
      render: (vt: VisitTemplate) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={() => onManageForms?.(vt)}
          >
            Forms
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(vt)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete?.(vt)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={visitTemplates}
      columns={columns}
      keyExtractor={(vt) => String(vt.id)}
      loading={loading}
      emptyTitle="No visit templates"
      emptyDescription="Create your first visit template"
      onRowClick={onSelect}
    />
  );
}

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { useSubjects, useCreateSubject, useDeleteSubject } from "../hooks/useSubjects";
import { toApiError } from "@/api/axios";
import type { Subject, CreateSubjectInput } from "@/types/subject.types";

// Inline SVG icons
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function SubjectsPage() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const { data: subjects, isLoading, isError, error, refetch } = useSubjects(studyId!);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [formData, setFormData] = useState<CreateSubjectInput>({
    subjectIdentifier: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
  });

  const createMutation = useCreateSubject(studyId!);
  const deleteMutation = useDeleteSubject(studyId!);

  const handleCreate = async () => {
    await createMutation.mutateAsync(formData);
    setShowCreateDialog(false);
    setFormData({
      subjectIdentifier: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(String(deleteTarget.id));
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const openDeleteDialog = (subject: Subject) => {
    setDeleteTarget(subject);
    setShowDeleteDialog(true);
  };

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
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)}>Add Subject</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-zinc-100" />
          ))}
        </div>
      ) : subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="group relative cursor-pointer rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              onClick={() => navigate(`/studies/${studyId}/subjects/${subject.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">
                      {subject.subjectIdentifier}
                    </h3>
                    <p className="text-sm text-zinc-500">ID: {subject.id}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(subject);
                  }}
                >
                  <TrashIcon className="h-4 w-4 text-red-600" />
                </Button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Enrolled: {subject.enrollmentDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  {subject.scheduleGenerated ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <CheckCircleIcon className="h-3 w-3" />
                      Schedule Generated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                      <ClockIcon className="h-3 w-3" />
                      Pending Schedule
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-zinc-50 py-12">
          <UserIcon className="h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-lg font-medium">No subjects enrolled</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Add your first subject to get started
          </p>
          <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
            Add Subject
          </Button>
        </div>
      )}

      {/* Create Subject Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
        <DialogHeader>
          <DialogTitle>Add Subject</DialogTitle>
          <DialogDescription>
            Enter the subject details to enroll a new subject in this study.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subjectIdentifier">Subject Identifier</Label>
              <Input
                id="subjectIdentifier"
                placeholder="e.g., SUB-001"
                value={formData.subjectIdentifier}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subjectIdentifier: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Enrollment Date</Label>
              <Input
                id="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, enrollmentDate: e.target.value }))
                }
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!formData.subjectIdentifier || createMutation.isPending}
          >
            {createMutation.isPending ? "Adding..." : "Add Subject"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete subject "{deleteTarget?.subjectIdentifier}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

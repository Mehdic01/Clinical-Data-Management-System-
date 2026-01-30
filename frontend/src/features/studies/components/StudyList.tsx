import { useNavigate } from "react-router-dom";
import type { Study } from "@/types/study.types";

type StudyListProps = {
  studies: Study[];
  loading?: boolean;
};

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function StudyCard({ study, onClick }: { study: Study; onClick: () => void }) {
  const isActive = study.status === "Active";
  
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl p-6 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] ${
        isActive 
          ? "bg-green-50 hover:bg-green-100" 
          : "bg-slate-50 hover:bg-slate-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            isActive ? "bg-green-200" : "bg-slate-200"
          }`}>
            <FileIcon className={`h-6 w-6 ${isActive ? "text-green-700" : "text-slate-600"}`} />
          </div>
          
          {/* Content */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
              {study.name}
            </h3>
            <span className="text-sm text-slate-500">{study.protocolCode}</span>
          </div>
        </div>

        {/* Status Badge & Arrow */}
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            isActive 
              ? "bg-green-200 text-green-800" 
              : "bg-slate-200 text-slate-600"
          }`}>
            {study.status}
          </span>
          <ChevronRightIcon className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}

export function StudyList({ studies, loading }: StudyListProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (studies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 py-16">
        <FileIcon className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-700">No studies found</h3>
        <p className="mt-1 text-slate-500">Create your first study to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {studies.map((study) => (
        <StudyCard
          key={study.id}
          study={study}
          onClick={() => navigate(`/studies/${study.id}`)}
        />
      ))}
    </div>
  );
}

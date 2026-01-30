import { useNavigate } from "react-router-dom";
import { useDashboardSummary } from "@/api/services/dashboard.service";
import { useStudies } from "@/features/studies/hooks/useStudies";

interface StatCardProps {
  value: number;
  label: string;
  description: string;
  color: "yellow" | "purple" | "teal" | "coral";
}

const colorClasses = {
  yellow: "bg-amber-400",
  purple: "bg-slate-500",
  teal: "bg-teal-400",
  coral: "bg-red-400",
};

function StatCard({ value, label, description, color }: StatCardProps) {
  return (
    <div className="flex flex-col rounded-xl bg-slate-50 p-6 shadow-md hover:shadow-lg transition-shadow">
      {/* Number Badge */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white ring-2 ring-white ${colorClasses[color]}`}
      >
        {value}
      </div>

      {/* Label */}
      <span className="mt-4 text-sm text-slate-400">{label}</span>

      {/* Description */}
      <span className="mt-1 text-base font-semibold text-slate-700">
        {description}
      </span>
    </div>
  );
}

interface ProgressCardProps {
  activeStudies: number;
  draftStudies: number;
}

function ProgressCard({ activeStudies, draftStudies }: ProgressCardProps) {
  const total = activeStudies + draftStudies;
  const percentage = total > 0 ? Math.round((activeStudies / total) * 100) : 0;
  
  // SVG circle properties
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-xl bg-blue-500 p-8 shadow-md">
      <div className="flex items-center gap-12">
        {/* Circular Progress */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-32 w-32 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
          {/* Percentage text */}
          <span className="absolute text-2xl font-bold text-white">
            {percentage} %
          </span>
        </div>

        {/* Text content */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-white">Average Progress</h3>
          <p className="mt-2 text-lg text-blue-100">
            <span className="font-bold text-white">{activeStudies}</span>
            <span className="mx-1">/</span>
            <span>{total}</span>
            <span className="ml-3">Studies</span>
          </p>
        </div>

        {/* Decorative clipboards */}
        <div className="ml-auto hidden lg:flex items-center gap-2">
          <svg className="h-24 w-20 text-white/30" viewBox="0 0 80 100" fill="currentColor">
            <rect x="10" y="15" width="60" height="80" rx="4" fill="white" opacity="0.9"/>
            <rect x="25" y="5" width="30" height="15" rx="2" fill="currentColor"/>
            <circle cx="40" cy="12" r="4" fill="white" opacity="0.5"/>
            <rect x="20" y="35" width="40" height="6" rx="2" fill="#3b82f6" opacity="0.4"/>
            <rect x="20" y="48" width="30" height="6" rx="2" fill="#3b82f6" opacity="0.4"/>
            <circle cx="55" cy="65" r="8" fill="#3b82f6" opacity="0.3"/>
            <path d="M52 65 L54 67 L58 63" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <svg className="h-20 w-16 text-white/20 -ml-6 mt-4" viewBox="0 0 80 100" fill="currentColor">
            <rect x="10" y="15" width="60" height="80" rx="4" fill="white" opacity="0.7"/>
            <rect x="25" y="5" width="30" height="15" rx="2" fill="currentColor"/>
            <circle cx="40" cy="12" r="4" fill="white" opacity="0.5"/>
            <circle cx="40" cy="50" r="12" fill="#3b82f6" opacity="0.3"/>
            <rect x="20" y="70" width="40" height="6" rx="2" fill="#3b82f6" opacity="0.4"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

interface StudyCarouselProps {
  studies: { id: string; name: string }[];
}

function StudyCarousel({ studies }: StudyCarouselProps) {
  if (studies.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500 shadow-md">
        No studies available
      </div>
    );
  }

  // Duplicate studies for seamless infinite scroll
  const duplicatedStudies = [...studies, ...studies];

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 shadow-md">
      <div className="relative py-6">
        {/* Gradient overlays for fade effect */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-slate-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-slate-100 to-transparent" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll">
          {duplicatedStudies.map((study, index) => (
            <div
              key={`${study.id}-${index}`}
              className="flex-shrink-0 px-8"
            >
              <span className="whitespace-nowrap text-2xl font-semibold text-slate-700 transition-colors hover:text-blue-600">
                {study.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading, error } = useDashboardSummary();
  const { data: studies } = useStudies();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load dashboard data
      </div>
    );
  }

  const stats: StatCardProps[] = [
    {
      value: summary?.activeStudies ?? 0,
      label: "Active Studies",
      description: "Total number of active studies",
      color: "yellow",
    },
    {
      value: summary?.draftStudies ?? 0,
      label: "Draft Studies",
      description: "Total number of draft studies",
      color: "purple",
    },
    {
      value: summary?.scheduledVisits ?? 0,
      label: "Scheduled Visits",
      description: "Total number of scheduled visits",
      color: "teal",
    },
    {
      value: summary?.doneScheduledVisits ?? 0,
      label: "Completed Visits",
      description: "Total number of completed visits",
      color: "coral",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Welcome to the Clinical Data Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Progress Card */}
      <ProgressCard
        activeStudies={summary?.activeStudies ?? 0}
        draftStudies={summary?.draftStudies ?? 0}
      />

      {/* Study Carousel */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">Our Studies</h2>
        <StudyCarousel studies={studies ?? []} />
      </div>

      {/* View Studies Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/studies")}
          className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:scale-105"
        >
          View Studies
          <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

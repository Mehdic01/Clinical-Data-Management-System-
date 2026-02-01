/**
 * DashboardPage
 * Uygulamadaki genel özet metriklerini ve hızlı bakış panellerini gösterir.
 * Dashboard verilerini API'den çeker, yüklenme/hata durumlarını yönetir ve
 * kullanıcıyı ilgili çalışma detayı sayfalarına yönlendiren aksiyonlar sunar.
 */
import { useNavigate } from "react-router-dom";
import { useDashboardSummary } from "@/api/services/dashboard.service";
import { useStudies } from "@/features/studies/hooks/useStudies";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Stat card color variants
type StatColor = "primary" | "success" | "warning" | "info";

interface StatCardProps {
  value: number;
  label: string;
  description: string;
  color: StatColor;
  icon: React.ReactNode;
}

const colorStyles: Record<StatColor, { bg: string; iconBg: string; text: string }> = {
  primary: {
    bg: "bg-gradient-to-br from-primary-50 to-primary-100/50",
    iconBg: "bg-primary-500 shadow-primary-500/30",
    text: "text-primary-600",
  },
  success: {
    bg: "bg-gradient-to-br from-success-50 to-success-100/50",
    iconBg: "bg-success-500 shadow-success-500/30",
    text: "text-success-600",
  },
  warning: {
    bg: "bg-gradient-to-br from-warning-50 to-warning-100/50",
    iconBg: "bg-warning-500 shadow-warning-500/30",
    text: "text-warning-600",
  },
  info: {
    bg: "bg-gradient-to-br from-info-50 to-info-100/50",
    iconBg: "bg-info-500 shadow-info-500/30",
    text: "text-info-600",
  },
};

function StatCard({ value, label, description, color, icon }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6",
      "bg-white border border-neutral-200/80",
      "shadow-card hover:shadow-card-hover",
      "transition-all duration-300",
      "group"
    )}>
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-50",
        "transition-transform duration-500 group-hover:scale-150",
        styles.bg
      )} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Value */}
          <div className={cn(
            "text-3xl font-bold tracking-tight",
            styles.text
          )}>
            {value}
          </div>

          {/* Label */}
          <p className="mt-1 text-sm font-medium text-neutral-600">
            {label}
          </p>

          {/* Description */}
          <p className="mt-2 text-xs text-neutral-400">
            {description}
          </p>
        </div>

        {/* Icon */}
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "text-white shadow-lg",
          styles.iconBg
        )}>
          {icon}
        </div>
      </div>
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
    <div className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700",
      "p-8 shadow-elevated"
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex items-center gap-8 lg:gap-12">
        {/* Circular Progress */}
        <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center">
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
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-white">
              {percentage}%
            </span>
            <span className="text-xs text-primary-100">Active</span>
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-white">
            Study Progress
          </h3>
          <p className="mt-2 text-primary-100">
            <span className="text-2xl font-bold text-white">{activeStudies}</span>
            <span className="mx-2 text-primary-200">/</span>
            <span className="text-lg">{total}</span>
            <span className="ml-2 text-sm">studies active</span>
          </p>
          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-sm text-primary-100">Active: {activeStudies}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="text-sm text-primary-100">Draft: {draftStudies}</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="ml-auto hidden lg:flex items-center gap-2 opacity-30">
          <svg className="h-24 w-20" viewBox="0 0 80 100" fill="currentColor">
            <rect x="10" y="15" width="60" height="80" rx="4" fill="white"/>
            <rect x="25" y="5" width="30" height="15" rx="2" className="text-primary-700" fill="currentColor"/>
            <circle cx="40" cy="12" r="4" fill="white" opacity="0.5"/>
            <rect x="20" y="35" width="40" height="6" rx="2" fill="currentColor" opacity="0.3"/>
            <rect x="20" y="48" width="30" height="6" rx="2" fill="currentColor" opacity="0.3"/>
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
      <div className={cn(
        "rounded-2xl bg-neutral-50 p-8",
        "border border-neutral-200/80",
        "text-center text-neutral-500"
      )}>
        <p>No studies available</p>
      </div>
    );
  }

  // Duplicate studies for seamless infinite scroll
  const duplicatedStudies = [...studies, ...studies];

  return (
    <div className={cn(
      "overflow-hidden rounded-2xl",
      "bg-gradient-to-r from-neutral-50 via-white to-neutral-50",
      "border border-neutral-200/80 shadow-card"
    )}>
      <div className="relative py-6">
        {/* Gradient overlays for fade effect */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-neutral-50 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-neutral-50 to-transparent" />
        
        {/* Scrolling container */}
        <div className="flex animate-scroll">
          {duplicatedStudies.map((study, index) => (
            <div
              key={`${study.id}-${index}`}
              className="flex-shrink-0 px-8"
            >
              <span className={cn(
                "whitespace-nowrap text-xl font-semibold",
                "text-neutral-700 transition-colors hover:text-primary-600",
                "cursor-pointer"
              )}>
                {study.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Icons for stat cards
function StudyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function DraftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
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
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-sm text-neutral-500 animate-pulse-soft">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "rounded-xl bg-danger-50 border border-danger-200 p-6",
        "flex items-center gap-3"
      )}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-100">
          <svg className="h-5 w-5 text-danger-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-danger-800">Failed to load dashboard</h3>
          <p className="text-sm text-danger-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      value: summary?.activeStudies ?? 0,
      label: "Active Studies",
      description: "Currently running clinical trials",
      color: "primary" as StatColor,
      icon: <StudyIcon className="h-6 w-6" />,
    },
    {
      value: summary?.draftStudies ?? 0,
      label: "Draft Studies",
      description: "Studies in preparation",
      color: "warning" as StatColor,
      icon: <DraftIcon className="h-6 w-6" />,
    },
    {
      value: summary?.scheduledVisits ?? 0,
      label: "Scheduled Visits",
      description: "Upcoming patient visits",
      color: "info" as StatColor,
      icon: <CalendarIcon className="h-6 w-6" />,
    },
    {
      value: summary?.doneScheduledVisits ?? 0,
      label: "Completed Visits",
      description: "Successfully completed",
      color: "success" as StatColor,
      icon: <CheckCircleIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-neutral-500">
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-800">Our Studies</h2>
          <button
            onClick={() => navigate("/studies")}
            className={cn(
              "text-sm font-medium text-primary-600",
              "hover:text-primary-700 transition-colors",
              "flex items-center gap-1"
            )}
          >
            View all
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
        <StudyCarousel studies={studies ?? []} />
      </div>

      {/* View Studies Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/studies")}
          className={cn(
            "group flex items-center gap-3",
            "rounded-xl px-8 py-4",
            "bg-gradient-to-r from-primary-500 to-primary-600",
            "text-lg font-semibold text-white",
            "shadow-lg shadow-primary-500/25",
            "transition-all duration-300",
            "hover:from-primary-600 hover:to-primary-700",
            "hover:shadow-xl hover:shadow-primary-500/30",
            "hover:scale-[1.02] active:scale-[0.98]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          )}
        >
          View Studies
          <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

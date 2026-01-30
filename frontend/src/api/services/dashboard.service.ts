import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

// Dashboard types
export interface DashboardSummary {
  activeStudies: number;
  draftStudies: number;
  scheduledVisits: number;
  doneScheduledVisits: number;
}

// API functions
async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<DashboardSummary>(ENDPOINTS.DASHBOARD_SUMMARY);
  return response.data;
}

// React Query hooks
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
}

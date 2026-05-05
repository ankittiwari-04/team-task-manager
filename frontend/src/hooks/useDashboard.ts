import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { dashboard as dashboardApi } from '../api';
import type { DashboardStats } from '../types';

export const useDashboardStats = (): UseQueryResult<DashboardStats> =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboardStats,
    refetchInterval: 60000
  });

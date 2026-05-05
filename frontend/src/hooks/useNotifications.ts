import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications as notificationsApi } from '../api';
import type { Notification, PaginatedResponse } from '../types';

type NotificationsResponse = PaginatedResponse<Notification> & { unreadCount: number };

export const useNotifications = () =>
  useQuery<NotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
    refetchInterval: 30000
  });

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id?: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

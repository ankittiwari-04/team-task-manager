import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { auth } from '../api';
import { useAuth } from '../context/AuthContext';
import { Role, type User } from '../types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  avatar: z.string().optional().refine((value) => !value || z.string().url().safeParse(value).success, 'Enter a valid URL')
});
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(8)
}).refine((data) => data.newPassword === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;
const initials = (name?: string) => (name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') : '?');

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const profile = useForm<ProfileForm>({ resolver: zodResolver(profileSchema), values: { name: user?.name ?? '', avatar: user?.avatar ?? '' } });
  const password = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });

  const saveProfile = profile.handleSubmit(async (values) => {
    try {
      const response = await auth.updateProfile(values);
      updateUser((response.user ?? response.data ?? response) as User);
      toast.success('Profile saved');
    } catch {
      toast.error('Could not save profile');
    }
  });

  const changePassword = password.handleSubmit(async (values) => {
    try {
      await auth.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      password.reset();
      toast.success('Password changed');
    } catch {
      toast.error('Could not change password');
    }
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">{user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" /> : initials(user?.name)}</div>
          <div><h2 className="text-xl font-bold">{user?.name}</h2><p className="text-gray-500">{user?.email}</p><span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${user?.role === Role.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user?.role}</span></div>
        </div>
      </section>
      <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-semibold">Edit Profile</h2>
        <form onSubmit={saveProfile} className="mt-4 space-y-4">
          <label className="block text-sm font-medium">Name<input className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...profile.register('name')} /></label>
          {profile.formState.errors.name && <p className="text-xs text-red-600">{profile.formState.errors.name.message}</p>}
          <label className="block text-sm font-medium">Avatar URL<input className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...profile.register('avatar')} /></label>
          {profile.formState.errors.avatar && <p className="text-xs text-red-600">{profile.formState.errors.avatar.message}</p>}
          <button type="submit" disabled={profile.formState.isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{profile.formState.isSubmitting ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </section>
      <section className="rounded-lg border bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="font-semibold">Change Password</h2>
        <form onSubmit={changePassword} className="mt-4 space-y-4">
          <label className="block text-sm font-medium">Current password<input type="password" className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...password.register('currentPassword')} /></label>
          <label className="block text-sm font-medium">New password<input type="password" className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...password.register('newPassword')} /></label>
          <label className="block text-sm font-medium">Confirm new password<input type="password" className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" {...password.register('confirmPassword')} /></label>
          {password.formState.errors.confirmPassword && <p className="text-xs text-red-600">{password.formState.errors.confirmPassword.message}</p>}
          <button type="submit" disabled={password.formState.isSubmitting} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{password.formState.isSubmitting ? 'Changing...' : 'Change Password'}</button>
        </form>
      </section>
    </div>
  );
}

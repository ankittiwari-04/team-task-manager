import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { useAddMember, useRemoveMember, useUpdateMemberRole } from '../../hooks/useProjects';
import { Role, type Project } from '../../types';

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');

export default function MembersTab({ projectId, project }: { projectId: string; project: Project }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(Role.MEMBER);
  const [error, setError] = useState('');
  const [removeUserId, setRemoveUserId] = useState<string | null>(null);
  const addMember = useAddMember(projectId);
  const removeMember = useRemoveMember(projectId);
  const updateRole = useUpdateMemberRole(projectId);
  const members = project.members ?? [];
  const currentMember = members.find((member) => member.userId === user?.id);
  const canManage = user?.role === Role.ADMIN || currentMember?.role === Role.ADMIN || project.ownerId === user?.id;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      await addMember.mutateAsync({ email, role });
      setEmail('');
      setRole(Role.MEMBER);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add member');
    }
  };

  return (
    <div className="space-y-5">
      {canManage && (
        <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:flex-row">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="member@example.com" className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950" />
          <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-950">
            <option value={Role.MEMBER}>Member</option>
            <option value={Role.ADMIN}>Admin</option>
          </select>
          <button type="submit" disabled={addMember.isPending} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">Add Member</button>
          {error && <p className="text-sm text-red-600 md:self-center">{error}</p>}
        </form>
      )}
      <div className="overflow-hidden rounded-lg border bg-white dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr><th className="px-4 py-3">Avatar</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {members.map((member) => {
              const isOwner = member.userId === project.ownerId;
              return (
                <tr key={member.id}>
                  <td className="px-4 py-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">{initials(member.user.name)}</div></td>
                  <td className="font-medium">{member.user.name}{isOwner && <span className="ml-2 text-xs text-gray-500">Owner</span>}</td>
                  <td className="text-gray-500">{member.user.email}</td>
                  <td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${member.role === Role.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{member.role}</span></td>
                  <td className="text-gray-500">{new Date(member.joinedAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    {canManage && !isOwner ? (
                      <div className="flex items-center gap-2">
                        <select value={member.role} onChange={(event) => updateRole.mutate({ userId: member.userId, role: event.target.value as Role })} className="rounded-md border-gray-300 text-sm dark:border-gray-700 dark:bg-gray-950">
                          <option value={Role.MEMBER}>Member</option>
                          <option value={Role.ADMIN}>Admin</option>
                        </select>
                        <button type="button" onClick={() => setRemoveUserId(member.userId)} className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ) : <span className="text-xs text-gray-400">Locked</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={Boolean(removeUserId)}
        onClose={() => setRemoveUserId(null)}
        onConfirm={() => {
          if (removeUserId) removeMember.mutate(removeUserId, { onSuccess: () => setRemoveUserId(null) });
        }}
        title="Remove member"
        description="This member will lose access to the project."
        confirmLabel="Remove"
        loading={removeMember.isPending}
      />
    </div>
  );
}

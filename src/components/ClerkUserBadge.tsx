import React from 'react';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { LogOut } from 'lucide-react';
import { UserSession } from '../types';

interface ClerkUserBadgeProps {
  currentRole: UserSession['role'];
  onSignOut: () => void;
  onOpenRoleMenu: () => void;
}

export const ClerkUserBadge: React.FC<ClerkUserBadgeProps> = ({
  currentRole,
  onSignOut,
  onOpenRoleMenu
}) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {}
    onSignOut();
  };

  const displayName = isLoaded && user
    ? user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Clerk User'
    : 'Authenticated';

  const displayEmail = isLoaded && user
    ? user.primaryEmailAddress?.emailAddress || ''
    : '';

  const roleLabel =
    currentRole === 'admin'
      ? 'Administrator'
      : currentRole === 'teacher'
      ? 'Teacher'
      : currentRole === 'registrar'
      ? 'Registrar'
      : 'Finance Officer';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '4px 8px 4px 6px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.14)',
        color: '#fff'
      }}
    >
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: { width: '32px', height: '32px' }
          }
        }}
      />
      <div
        style={{ cursor: 'pointer', textAlign: 'left' }}
        onClick={onOpenRoleMenu}
        title="Click to switch school role"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <b style={{ fontSize: '13px', color: '#fff', lineHeight: 1.2 }}>{displayName}</b>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '6px',
              background: '#0873ed',
              color: '#fff',
              fontWeight: 700
            }}
          >
            {roleLabel}
          </span>
        </div>
        <small style={{ display: 'block', fontSize: '11px', color: '#a0c7f2' }}>
          {displayEmail || 'Clerk Account'} • Switch Role ▾
        </small>
      </div>

      <button
        type="button"
        className="icon-btn signout"
        onClick={(e) => {
          e.stopPropagation();
          handleSignOut();
        }}
        title="Sign out of Clerk"
        aria-label="Sign out"
        style={{ marginLeft: '4px' }}
      >
        <LogOut style={{ width: '15px', height: '15px' }} />
      </button>
    </div>
  );
};

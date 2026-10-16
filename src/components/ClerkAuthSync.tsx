import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { UserSession } from '../types';

interface ClerkAuthSyncProps {
  onSyncUser: (session: UserSession) => void;
  onSignedOut: () => void;
}

export const ClerkAuthSync: React.FC<ClerkAuthSyncProps> = ({ onSyncUser, onSignedOut }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress || 'staff@ntba.edu.gh';
      const name =
        user.fullName ||
        (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
        user.username ||
        email.split('@')[0];

      // Read role from user's public metadata if configured in Clerk Dashboard, else retain or default to admin
      const clerkRole = (user.publicMetadata?.role as UserSession['role']) || 'admin';

      onSyncUser({
        name,
        email,
        role: clerkRole,
        avatar: user.imageUrl,
        clerkId: user.id
      });
    } else if (!isSignedIn) {
      onSignedOut();
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
};

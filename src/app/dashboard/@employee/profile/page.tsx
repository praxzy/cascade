'use client';

import { useState } from 'react';

import { AlertTriangle, Building2, Copy, ExternalLink, Mail, User, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { EmptyState } from '@/components/dashboard/empty-state';
import { useSolana } from '@/components/solana/use-solana';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EmployeeProfilePage() {
  const { account, connected } = useSolana();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const handleLeaveOrganization = () => {
    // TODO: Replace with actual leave organization mutation
    setLeaveDialogOpen(false);
    toast.success('Leave organization request submitted');
  };

  if (!connected || !account) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState title="Connect Your Wallet" description="Connect your wallet to view your profile" />
      </div>
    );
  }

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      toast.success('Address copied to clipboard');
    }
  };

  // Mock data - TODO: Fetch from backend/blockchain
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    organization: 'Acme Corp',
    organizationRole: 'Software Engineer',
    joinedDate: new Date('2025-10-01'),
    walletAddress: account?.address || '',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your profile and account settings</p>
      </div>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{profileData.name}</h2>
            <p className="text-sm text-muted-foreground">{profileData.organizationRole}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={profileData.name} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input id="email" type="email" defaultValue={profileData.email} disabled />
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Organization</h2>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <Input id="organization" defaultValue={profileData.organization} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={profileData.organizationRole} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joined">Member Since</Label>
            <Input
              id="joined"
              defaultValue={profileData.joinedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              disabled
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Wallet Address</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
            <code className="flex-1 text-sm">
              {profileData.walletAddress
                ? `${profileData.walletAddress.slice(0, 12)}...${profileData.walletAddress.slice(-12)}`
                : 'N/A'}
            </code>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
              <a
                href={`https://explorer.solana.com/address/${profileData.walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Account Actions</h2>
        <div className="space-y-5">
          <div className="space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-destructive">Danger Zone</h3>
                <p className="text-sm text-destructive/80">
                  Leaving your organization revokes access to streams, history, and future payments. This cannot be
                  undone without an employer invite.
                </p>
              </div>
            </div>

            <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
              <Button variant="destructive" className="w-full" onClick={() => setLeaveDialogOpen(true)}>
                Leave Organization
              </Button>

              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-destructive">Leave Organization</DialogTitle>
                  <DialogDescription>
                    Leaving {profileData.organization} will immediately revoke your access to dashboards, payment
                    streams, and future payouts. This action can only be reversed by a new employer invitation.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive/80">
                  <p className="font-semibold text-destructive">You&apos;re about to:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Stop all active payment streams</li>
                    <li>Lose access to your payment history dashboard</li>
                    <li>Require a new invitation to rejoin</li>
                  </ul>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleLeaveOrganization}>
                    Confirm Leave
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { Mail, MapPin, SirenIcon as StreamIcon, Tag, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

import { useDashboard } from '../dashboard-context';

interface EmployeeDetailPanelProps {
  employeeId: string;
  onClose: () => void;
  isOpen: boolean;
}

// Mock employee detail
const MOCK_EMPLOYEE_DETAIL = {
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  walletAddress: '7xL...abc',
  backupWallet: '7xL...backup',
  department: 'Engineering',
  location: 'San Francisco, CA',
  employmentType: 'Full-time',
  status: 'ready',
  hourlyWage: 50,
  linkedStreams: 1,
  tags: ['Senior', 'Backend'],
  notificationPreferences: {
    email: true,
    sms: false,
    webhook: true,
  },
};

export function EmployeeDetailPanel({ employeeId, onClose, isOpen }: EmployeeDetailPanelProps) {
  const employee = { ...MOCK_EMPLOYEE_DETAIL, id: employeeId };
  const isMobile = useIsMobile();
  const {
    setIsViewStreamsModalOpen,
    setIsEditEmployeeModalOpen,
    setIsArchiveEmployeeModalOpen,
    setSelectedEmployeeId,
  } = useDashboard();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/10 text-green-700';
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-700';
      case 'invited':
        return 'bg-blue-500/10 text-blue-700';
      case 'archived':
        return 'bg-gray-500/10 text-gray-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  const handleViewStreams = () => {
    setSelectedEmployeeId(employee.id);
    setIsViewStreamsModalOpen(true);
  };

  const handleEditEmployee = () => {
    setSelectedEmployeeId(employee.id);
    setIsEditEmployeeModalOpen(true);
  };

  const handleArchiveEmployee = () => {
    setSelectedEmployeeId(employee.id);
    setIsArchiveEmployeeModalOpen(true);
  };

  const handleCreateStream = () => {
    setSelectedEmployeeId(employee.id);
    setIsEditEmployeeModalOpen(true);
  };

  return (
    <Drawer
      direction={isMobile ? undefined : 'right'}
      modal={false}
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent
        className={`max-h-full ${isMobile ? '' : 'fixed top-0 right-0 bottom-0 w-96 rounded-none border-l'}`}
        style={!isMobile ? { left: 'auto', right: 0, top: 0, bottom: 0, borderRadius: 0 } : {}}
      >
        <div className="absolute top-4 right-4 z-10">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto ${isMobile ? 'px-4 pt-12 pb-6' : 'px-6 pt-12 pb-6'}`}>
          <div className="space-y-4">
            {/* Header */}
            <div>
              <DrawerTitle className="text-lg font-bold">{employee.name}</DrawerTitle>
              <p className="mt-1 text-xs text-muted-foreground">{employee.email}</p>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(employee.status)} variant="secondary">
                {employee.status}
              </Badge>
            </div>

            {/* Contact Information Card */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Contact Information</p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="truncate text-sm font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{employee.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details Card */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Employment Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{employee.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">{employee.employmentType}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  <p className="text-lg font-bold">${employee.hourlyWage}/hr</p>
                </div>
              </div>
            </div>

            {/* Wallet Information Card */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Wallet Information</p>
              <div className="space-y-2">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Primary Wallet</p>
                  <code className="block truncate rounded border bg-background p-2 font-mono text-xs">
                    {employee.walletAddress}
                  </code>
                </div>
                {employee.backupWallet && (
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Backup Wallet</p>
                    <code className="block truncate rounded border bg-background p-2 font-mono text-xs">
                      {employee.backupWallet}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Card */}
            {employee.tags.length > 0 && (
              <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {employee.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Streams Card */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Linked Streams</p>
              <div className="flex items-center gap-2">
                <StreamIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {employee.linkedStreams > 0 ? (
                    <span>{employee.linkedStreams} active stream(s)</span>
                  ) : (
                    <span className="text-muted-foreground">No active streams</span>
                  )}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button size="sm" onClick={handleEditEmployee} className="w-full">
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={handleViewStreams} className="w-full bg-transparent">
                Streams
              </Button>
              <Button size="sm" variant="outline" onClick={handleCreateStream} className="w-full bg-transparent">
                Create
              </Button>
              <Button size="sm" variant="outline" onClick={handleArchiveEmployee} className="w-full bg-transparent">
                Archive
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

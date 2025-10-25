'use client';

import { useState } from 'react';

import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'profile' | 'wallet' | 'settings' | 'review';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
}

// Mock employee data
const MOCK_EMPLOYEE = {
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  department: 'Engineering',
  location: 'San Francisco, CA',
  employmentType: 'Full-time',
  primaryWallet: '7xL...abc',
  backupWallet: '7xL...backup',
  hourlyWage: '50',
  tags: 'Senior, Backend',
};

export function EditEmployeeModal({ isOpen, onClose, employeeId }: EditEmployeeModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile step
  const [name, setName] = useState(MOCK_EMPLOYEE.name);
  const [email, setEmail] = useState(MOCK_EMPLOYEE.email);
  const [department, setDepartment] = useState(MOCK_EMPLOYEE.department);
  const [location, setLocation] = useState(MOCK_EMPLOYEE.location);
  const [employmentType, setEmploymentType] = useState(MOCK_EMPLOYEE.employmentType);

  // Wallet step
  const [primaryWallet, setPrimaryWallet] = useState(MOCK_EMPLOYEE.primaryWallet);
  const [backupWallet, setBackupWallet] = useState(MOCK_EMPLOYEE.backupWallet);

  // Settings step
  const [hourlyWage, setHourlyWage] = useState(MOCK_EMPLOYEE.hourlyWage);
  const [tags, setTags] = useState(MOCK_EMPLOYEE.tags);

  const resetForm = () => {
    setCurrentStep('profile');
    setName(MOCK_EMPLOYEE.name);
    setEmail(MOCK_EMPLOYEE.email);
    setDepartment(MOCK_EMPLOYEE.department);
    setLocation(MOCK_EMPLOYEE.location);
    setEmploymentType(MOCK_EMPLOYEE.employmentType);
    setPrimaryWallet(MOCK_EMPLOYEE.primaryWallet);
    setBackupWallet(MOCK_EMPLOYEE.backupWallet);
    setHourlyWage(MOCK_EMPLOYEE.hourlyWage);
    setTags(MOCK_EMPLOYEE.tags);
  };

  const handleNext = () => {
    const steps: Step[] = ['profile', 'wallet', 'settings', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['profile', 'wallet', 'settings', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email || !department || !location || !primaryWallet || !hourlyWage) {
      toast.error('Missing required fields', {
        description: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Employee updated successfully!', {
        description: `${name}'s profile (ID: ${employeeId}) has been updated with all changes.`,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to update employee', { employeeId, error });
      toast.error('Failed to update employee', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (currentStep !== 'profile' || name !== MOCK_EMPLOYEE.name) {
      toast.info('Edit cancelled', {
        description: 'Your changes have been discarded.',
      });
    }
    resetForm();
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'profile':
        return name && email && department && location && employmentType;
      case 'wallet':
        return primaryWallet;
      case 'settings':
        return hourlyWage;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex gap-2">
            {['profile', 'wallet', 'settings', 'review'].map((step, index) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full ${
                  ['profile', 'wallet', 'settings', 'review'].indexOf(currentStep) >= index ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Profile */}
          {currentStep === 'profile' && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Employee Profile</h3>
                <p className="text-sm text-muted-foreground">Update employee information</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="employment-type">Employment Type</Label>
                    <Input
                      id="employment-type"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Wallet */}
          {currentStep === 'wallet' && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Wallet Information</h3>
                <p className="text-sm text-muted-foreground">Update wallet addresses</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-wallet">Primary Wallet Address</Label>
                  <Input id="primary-wallet" value={primaryWallet} onChange={(e) => setPrimaryWallet(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-wallet">Backup Wallet (Optional)</Label>
                  <Input id="backup-wallet" value={backupWallet} onChange={(e) => setBackupWallet(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 'settings' && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Employment Settings</h3>
                <p className="text-sm text-muted-foreground">Update wage and preferences</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hourly-wage">Hourly Wage (USD)</Label>
                  <Input
                    id="hourly-wage"
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Review & Confirm</h3>
                <p className="text-sm text-muted-foreground">Verify all changes before saving</p>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department</span>
                    <span className="font-medium">{department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employment Type</span>
                    <span className="font-medium">{employmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hourly Wage</span>
                    <span className="font-medium">${hourlyWage}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 border-t border-border pt-6">
            <Button
              variant="outline"
              onClick={currentStep === 'profile' ? handleClose : handleBack}
              className="flex-1 bg-transparent"
            >
              {currentStep === 'profile' ? 'Cancel' : 'Back'}
            </Button>
            <Button
              onClick={currentStep === 'review' ? handleSubmit : handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="flex-1 gap-2"
            >
              {isSubmitting ? 'Saving...' : currentStep === 'review' ? 'Save Changes' : 'Next'}
              {!isSubmitting && currentStep !== 'review' && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

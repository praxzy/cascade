'use client';

import { useState } from 'react';

import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'profile' | 'wallet' | 'settings' | 'review';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('profile');

  // Profile step
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');

  // Wallet step
  const [primaryWallet, setPrimaryWallet] = useState('');
  const [backupWallet, setBackupWallet] = useState('');

  // Settings step
  const [hourlyWage, setHourlyWage] = useState('');
  const [tags, setTags] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCurrentStep('profile');
    setName('');
    setEmail('');
    setDepartment('');
    setLocation('');
    setEmploymentType('Full-time');
    setPrimaryWallet('');
    setBackupWallet('');
    setHourlyWage('');
    setTags('');
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
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Employee added successfully!', {
        description: `${name} has been added to your team.`,
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to add employee', error);
      toast.error('Failed to add employee', {
        description: 'Please check your information and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (currentStep !== 'profile' || name) {
      toast.info('Employee creation cancelled', {
        description: 'Your progress has been discarded.',
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
          <DialogTitle>Add Employee</DialogTitle>
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
                <p className="text-sm text-muted-foreground">Basic information about the employee</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Engineering"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="employment-type">Employment Type</Label>
                    <Input
                      id="employment-type"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      placeholder="Full-time"
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
                <p className="text-sm text-muted-foreground">Employee&apos;s Solana wallet address</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-wallet">Primary Wallet Address</Label>
                  <Input
                    id="primary-wallet"
                    value={primaryWallet}
                    onChange={(e) => setPrimaryWallet(e.target.value)}
                    placeholder="7xL..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backup-wallet">Backup Wallet (Optional)</Label>
                  <Input
                    id="backup-wallet"
                    value={backupWallet}
                    onChange={(e) => setBackupWallet(e.target.value)}
                    placeholder="7xL..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 'settings' && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Employment Settings</h3>
                <p className="text-sm text-muted-foreground">Wage and preferences</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hourly-wage">Hourly Wage (USD)</Label>
                  <Input
                    id="hourly-wage"
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(e.target.value)}
                    placeholder="50.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Senior, Backend, Full-time"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Review & Confirm</h3>
                <p className="text-sm text-muted-foreground">Verify all details before adding the employee</p>
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
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="text-muted-foreground">Status</span>
                    <Badge>Ready</Badge>
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
              {isSubmitting ? 'Adding...' : currentStep === 'review' ? 'Add Employee' : 'Next'}
              {!isSubmitting && currentStep !== 'review' && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

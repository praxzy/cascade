import { useMemo, useState } from 'react';

import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface OnboardingWizardProps {
  isOpen: boolean;
  onDismiss: () => void;
  onComplete: () => void;
}

type Step = 'wallet' | 'organization' | 'token' | 'compliance';
type ValidationErrors = Record<string, string>;

export function OnboardingWizard({ isOpen, onDismiss, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('wallet');
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [showValidationFeedback, setShowValidationFeedback] = useState(false);

  const steps: Array<{ id: Step; title: string; description: string }> = useMemo(
    () => [
      {
        id: 'wallet',
        title: 'Connect Wallet',
        description: 'Verify your Solana wallet',
      },
      {
        id: 'organization',
        title: 'Organization Profile',
        description: 'Tell us about your team',
      },
      {
        id: 'token',
        title: 'Select Token',
        description: 'Choose your default SPL token',
      },
      {
        id: 'compliance',
        title: 'Compliance',
        description: 'Acknowledge key policies',
      },
    ],
    [],
  );

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  // Step 1: Wallet
  const [walletConnected, setWalletConnected] = useState(false);

  // Step 2: Organization
  const [organizationName, setOrganizationName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [timezone, setTimezone] = useState('');

  // Step 3: Token
  const [selectedMint, setSelectedMint] = useState('');

  // Step 4: Compliance
  const [fundingAcknowledged, setFundingAcknowledged] = useState(false);
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState(false);

  const validateStep = (step: Step): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (step === 'wallet' && !walletConnected) {
      errors.walletConnected = 'Confirm your employer wallet to continue.';
    }

    if (step === 'organization') {
      if (!organizationName.trim()) {
        errors.organizationName = 'Organization name is required.';
      }
      if (!supportEmail.trim()) {
        errors.supportEmail = 'Support email is required.';
      }
      if (!timezone) {
        errors.timezone = 'Select the timezone your team operates in.';
      }
    }

    if (step === 'token' && !selectedMint) {
      errors.selectedMint = 'Select at least one treasury token.';
    }

    if (step === 'compliance') {
      if (!fundingAcknowledged) {
        errors.fundingAcknowledged = 'Please acknowledge the funding responsibility.';
      }
      if (!emergencyAcknowledged) {
        errors.emergencyAcknowledged = 'Please acknowledge the emergency withdrawal policy.';
      }
    }

    return errors;
  };

  const attemptAdvance = () => {
    const errors = validateStep(currentStep);
    const hasErrors = Object.keys(errors).length > 0;

    setShowValidationFeedback(hasErrors);

    return !hasErrors;
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    setShowValidationFeedback(false);
  };

  const handleStepComplete = () => {
    if (!attemptAdvance()) return;

    const nextIndex = currentStepIndex + 1;
    const nextStep = steps[nextIndex]?.id;
    if (!nextStep) return;

    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    goToStep(nextStep);
  };

  const handleBack = () => {
    if (currentStepIndex === 0) return;
    const previousStep = steps[currentStepIndex - 1]?.id;
    if (previousStep) {
      goToStep(previousStep);
    }
  };

  const handleFinish = () => {
    if (!attemptAdvance()) return;

    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);
    onComplete();
  };

  const validationErrors: ValidationErrors = showValidationFeedback ? validateStep(currentStep) : {};

  const hasFieldError = (field: string) => showValidationFeedback && Boolean(validationErrors[field]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">First-time setup</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Let&apos;s get your organization ready
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Complete each step to unlock real-time payroll automations and invite your team.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} aria-label="Finish later">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-8 space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.max(progress, 5)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span>{currentStepIndex + 1 === steps.length ? 'Final review' : steps[currentStepIndex + 1]?.title}</span>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px,1fr]">
          <aside className="rounded-xl border border-border bg-card/60 p-6">
            <div className="space-y-5">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = completedSteps.has(step.id);
                return (
                  <div key={step.id} className="flex items-start gap-4">
                    <div
                      className={cn(
                        'mt-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold',
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <p className={cn('font-medium', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="mb-2">
                  {currentStepIndex + 1} / {steps.length}
                </Badge>
                <h2 className="text-xl font-semibold text-foreground">{steps[currentStepIndex]?.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{steps[currentStepIndex]?.description}</p>
              </div>
            </div>

            {showValidationFeedback && Object.keys(validationErrors).length > 0 && (
              <div
                className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
                role="alert"
              >
                Looks like a few required details are missing. Please update the highlighted fields before continuing.
              </div>
            )}

            <div className="mt-6 space-y-6">
              {currentStep === 'wallet' && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <p className="text-sm font-medium text-foreground">Connected wallet</p>
                    <p className="mt-1 text-xs text-muted-foreground">7xL...abc123 · devnet</p>
                  </div>
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg border border-dashed border-border/80 bg-background p-4',
                      hasFieldError('walletConnected') && 'border-destructive bg-destructive/10',
                    )}
                  >
                    <Checkbox
                      id="wallet-confirm"
                      checked={walletConnected}
                      onCheckedChange={(checked) => setWalletConnected(Boolean(checked))}
                    />
                    <Label htmlFor="wallet-confirm" className="text-sm leading-relaxed text-foreground">
                      I confirm this is the treasury wallet we will use for payroll streams.
                    </Label>
                  </div>
                  {hasFieldError('walletConnected') && (
                    <p className="text-xs text-destructive">{validationErrors.walletConnected}</p>
                  )}
                </div>
              )}

              {currentStep === 'organization' && (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="org-name">Organization name</Label>
                      <Input
                        id="org-name"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Cascade Labs"
                        aria-invalid={hasFieldError('organizationName')}
                      />
                      {hasFieldError('organizationName') && (
                        <p className="text-xs text-destructive">{validationErrors.organizationName}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="support-email">Support email</Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="payroll@cascade.app"
                        aria-invalid={hasFieldError('supportEmail')}
                      />
                      {hasFieldError('supportEmail') && (
                        <p className="text-xs text-destructive">{validationErrors.supportEmail}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Primary timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone" aria-invalid={hasFieldError('timezone')}>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasFieldError('timezone') && (
                        <p className="text-xs text-destructive">{validationErrors.timezone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'token' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose the token you want Cascade to pull from when funding employee payroll streams. You can add
                    more tokens later.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {['USDC', 'USDT', 'SOL'].map((mint) => {
                      const isSelected = selectedMint === mint;
                      return (
                        <button
                          key={mint}
                          type="button"
                          onClick={() => setSelectedMint(mint)}
                          className={cn(
                            'rounded-lg border border-border bg-background p-4 text-left transition-all',
                            isSelected && 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/30',
                            !isSelected && 'hover:bg-muted/50',
                            hasFieldError('selectedMint') && !isSelected ? 'border-destructive/70' : null,
                          )}
                        >
                          <p className="font-semibold text-foreground">{mint}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {mint === 'USDC' && 'USD Coin · Recommended'}
                            {mint === 'USDT' && 'Tether USD'}
                            {mint === 'SOL' && 'Solana native token'}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {hasFieldError('selectedMint') && (
                    <p className="text-xs text-destructive">{validationErrors.selectedMint}</p>
                  )}
                </div>
              )}

              {currentStep === 'compliance' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Cascade requires these acknowledgments to safeguard your team and comply with Solana payment
                    standards.
                  </p>
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg border border-border bg-background p-4',
                      hasFieldError('fundingAcknowledged') && 'border-destructive bg-destructive/10',
                    )}
                  >
                    <Checkbox
                      id="funding-ack"
                      checked={fundingAcknowledged}
                      onCheckedChange={(checked) => setFundingAcknowledged(Boolean(checked))}
                    />
                    <Label htmlFor="funding-ack" className="text-sm leading-relaxed text-foreground">
                      I understand that our treasury wallet must remain funded to cover all active payroll streams.
                    </Label>
                  </div>
                  {hasFieldError('fundingAcknowledged') && (
                    <p className="text-xs text-destructive">{validationErrors.fundingAcknowledged}</p>
                  )}
                  <div
                    className={cn(
                      'flex items-start gap-3 rounded-lg border border-border bg-background p-4',
                      hasFieldError('emergencyAcknowledged') && 'border-destructive bg-destructive/10',
                    )}
                  >
                    <Checkbox
                      id="emergency-ack"
                      checked={emergencyAcknowledged}
                      onCheckedChange={(checked) => setEmergencyAcknowledged(Boolean(checked))}
                    />
                    <Label htmlFor="emergency-ack" className="text-sm leading-relaxed text-foreground">
                      I understand that emergency withdrawals suspend affected streams and may impact employee
                      compensation.
                    </Label>
                  </div>
                  {hasFieldError('emergencyAcknowledged') && (
                    <p className="text-xs text-destructive">{validationErrors.emergencyAcknowledged}</p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="w-full justify-center gap-2 sm:w-auto sm:justify-start"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={onDismiss} className="gap-2">
              Finish later
            </Button>
            <Button
              type="button"
              onClick={currentStep === 'compliance' ? handleFinish : handleStepComplete}
              className="gap-2"
            >
              {currentStep === 'compliance' ? 'Complete setup' : 'Save & continue'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

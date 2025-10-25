'use client';

import { DollarSign } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ViewStreamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
}

// Mock streams data for employee
const MOCK_EMPLOYEE_STREAMS = [
  {
    id: '1',
    name: 'Alice - Engineering Salary',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    amount: 50,
    frequency: 'hourly',
    totalPaid: 12500,
  },
];

export function ViewStreamsModal({ isOpen, onClose, employeeName }: ViewStreamsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Streams for {employeeName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {MOCK_EMPLOYEE_STREAMS.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No active streams for this employee</p>
            </div>
          ) : (
            <div className="space-y-3">
              {MOCK_EMPLOYEE_STREAMS.map((stream) => (
                <Card key={stream.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{stream.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {stream.startDate} to {stream.endDate}
                          </p>
                        </div>
                        <Badge variant={stream.status === 'active' ? 'default' : 'secondary'}>{stream.status}</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Rate</p>
                          <div className="mt-1 flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">
                              {stream.amount}/{stream.frequency}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Paid</p>
                          <p className="mt-1 font-medium">${stream.totalPaid.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="mt-1 font-medium capitalize">{stream.status}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-3 border-t border-border pt-6">
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

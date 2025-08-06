'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Cpu, MemoryStick } from 'lucide-react';
import { optimizeVMResources, type OptimizeVMResourcesOutput } from '@/ai/flows/optimize-vm-resources';
import type { VM } from '@/lib/mock-data';

type OptimizationModalProps = {
  vm: VM;
  isOpen: boolean;
  onClose: () => void;
};

// Generate fake historical data for the AI model
const generateUsageHistory = (baseUsage: number) => {
  return Array.from({ length: 10 }, () => baseUsage + (Math.random() - 0.5) * 20).map(u => Math.max(0, Math.min(100, u)));
};

export function OptimizationModal({ vm, isOpen, onClose }: OptimizationModalProps) {
  const [result, setResult] = useState<OptimizeVMResourcesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await optimizeVMResources({
        vmId: vm.id,
        currentCpu: vm.maxCpu,
        currentMemory: vm.maxMemory,
        cpuUsageHistory: generateUsageHistory(vm.cpuUsage),
        memoryUsageHistory: generateUsageHistory(vm.memoryUsage),
        networkUsageHistory: generateUsageHistory(Math.random() * 30),
        diskUsageHistory: generateUsageHistory(Math.random() * 50),
      });
      setResult(response);
    } catch (e) {
      setError('Failed to get optimization suggestions. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [vm]);

  useEffect(() => {
    if (isOpen) {
      handleOptimize();
    }
  }, [isOpen, handleOptimize]);

  
  const handleClose = () => {
    onClose();
    // Reset state after dialog closes
    setTimeout(() => {
      setResult(null);
      setError(null);
      setIsLoading(false);
    }, 300);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Optimize VM: {vm.name}</DialogTitle>
          <DialogDescription>
            AI-powered recommendations to optimize resource allocation for this VM.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[200px] flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Analyzing usage data...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {result && (
            <div className="space-y-4 w-full">
              <div>
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
                        <Cpu className="h-8 w-8 mb-2 text-primary"/>
                        <p className="text-sm text-muted-foreground">CPU Cores</p>
                        <p className="text-2xl font-bold">{result.cpuRecommendation}</p>
                        <p className="text-xs text-muted-foreground">Current: {vm.maxCpu}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 text-center">
                        <MemoryStick className="h-8 w-8 mb-2 text-primary"/>
                        <p className="text-sm text-muted-foreground">Memory</p>
                        <p className="text-2xl font-bold">{result.memoryRecommendation} GB</p>
                         <p className="text-xs text-muted-foreground">Current: {vm.maxMemory} GB</p>
                    </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Justification</h3>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">{result.justification}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Close</Button>
          <Button onClick={handleOptimize} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Re-analyze'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

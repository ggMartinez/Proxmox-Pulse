import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ReactNode } from 'react';

type NodeStatusCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  footerText: string;
};

export function NodeStatusCard({ title, value, icon, footerText }: NodeStatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}%</div>
        <p className="text-xs text-muted-foreground">{footerText}</p>
        <Progress value={value} className="mt-4 h-2" />
      </CardContent>
    </Card>
  );
}

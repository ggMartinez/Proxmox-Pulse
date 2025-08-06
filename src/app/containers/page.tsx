import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, View } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getContainers } from '@/lib/proxmox';

export default async function ContainersPage() {
  const containersResult = await getContainers();

  if (!containersResult.success) {
    return (
       <div>
        <h1 className="text-3xl font-bold tracking-tight mb-6">Containers</h1>
        <div className="p-4 rounded-md border border-destructive/50 bg-destructive/10 text-destructive">
          <p>Failed to load Containers: {containersResult.error}</p>
        </div>
      </div>
    )
  }

  const containers = containersResult.data;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Containers</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {containers.map((container) => (
          <Card key={container.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{container.name}</span>
                <Badge variant="outline" className="capitalize">
                    <div className={cn('h-2 w-2 rounded-full mr-2', container.status === 'running' ? 'bg-accent' : 'bg-muted-foreground')}></div>
                    {container.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>CPU: {container.cpuUsage}%</p>
                <p>Memory: {container.memoryUsage}%</p>
                <p>Disk: {container.diskUsage}%</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="ghost" size="sm">
                  <View className="mr-2 h-4 w-4" />
                  Details
                </Button>
                <Button variant="ghost" size="sm">
                  <Terminal className="mr-2 h-4 w-4" />
                  Terminal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

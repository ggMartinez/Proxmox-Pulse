import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { storages } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

export default function StoragesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Storages</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {storages.map((storage) => (
          <Card key={storage.id}>
            <CardHeader>
              <CardTitle>{storage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Type: {storage.type}</p>
                <p>Usage: {storage.usage}%</p>
              </div>
              <Progress value={storage.usage} className="mt-2 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

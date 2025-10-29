import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { keysApi } from '@/lib/api';

const Keys = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ key_uid: '', owner: '', label: '' });
  const { toast } = useToast();

  const fetchKeys = async () => {
    const { data } = await keysApi.getAll();
    if (data) setKeys(data);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await keysApi.create(formData);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Key registered successfully' });
      setIsDialogOpen(false);
      setFormData({ key_uid: '', owner: '', label: '' });
      fetchKeys();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await keysApi.delete(id);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Key deleted successfully' });
      fetchKeys();
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Keys</h1>
          <p className="text-muted-foreground">Manage access keys and credentials</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Register Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Key</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key_uid">Key UID</Label>
                <Input
                  id="key_uid"
                  placeholder="A1B2C3D4"
                  value={formData.key_uid}
                  onChange={(e) => setFormData({ ...formData, key_uid: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner Name</Label>
                <Input
                  id="owner"
                  placeholder="John Doe"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="Employee Badge"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Register Key</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {keys.map((key) => (
          <Card key={key.id} className="shadow-card transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-accent">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{key.owner}</CardTitle>
                    <p className="text-xs text-muted-foreground">{key.label}</p>
                  </div>
                </div>
                <StatusBadge status={key.status || 'active'} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-muted/30 p-3">
                <div className="text-xs text-muted-foreground">Key UID</div>
                <div className="font-mono text-sm font-semibold text-foreground">{key.key_uid}</div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => handleDelete(key.id)}
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Revoke Key
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Keys;

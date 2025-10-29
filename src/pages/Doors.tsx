import { useEffect, useState } from 'react';
import { Plus, Lock, Unlock, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { doorsApi, deviceApi } from '@/lib/api';

const Doors = () => {
  const [doors, setDoors] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', deviceId: '' });
  const { toast } = useToast();

  const fetchDoors = async () => {
    const { data } = await doorsApi.getAll();
    if (data) setDoors(data);
  };

  useEffect(() => {
    fetchDoors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await doorsApi.create(formData);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Door added successfully' });
      setIsDialogOpen(false);
      setFormData({ name: '', location: '', deviceId: '' });
      fetchDoors();
    }
  };

  const handleLockToggle = async (door: any) => {
    const command = door.status === 'locked' ? 'unlock' : 'lock';
    const { error } = await deviceApi.sendCommand(door.deviceId, command);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Door ${command}ed successfully` });
      fetchDoors();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await doorsApi.delete(id);
    
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Door deleted successfully' });
      fetchDoors();
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doors</h1>
          <p className="text-muted-foreground">Manage your access points</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Door
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Door</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Door Name</Label>
                <Input
                  id="name"
                  placeholder="Main Entrance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Building A, Floor 1"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  placeholder="DEV-001"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Door</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doors.map((door) => (
          <Card key={door.id} className="shadow-card transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{door.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{door.location}</p>
                </div>
                <StatusBadge status={door.status || 'locked'} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">
                Device: {door.deviceId}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleLockToggle(door)}
                >
                  {door.status === 'locked' ? (
                    <><Unlock className="mr-1 h-3 w-3" /> Unlock</>
                  ) : (
                    <><Lock className="mr-1 h-3 w-3" /> Lock</>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(door.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doors;

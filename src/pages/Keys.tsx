import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { keysApi, usersApi } from '@/lib/api';

const Keys = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);

  // ✅ user_id instead of owner
  const [formData, setFormData] = useState({ key_uid: '', user_id: '', label: '' });
  const { toast } = useToast();

  const fetchKeys = async () => {
    const { data } = await keysApi.getAll();
    if (data) setKeys(data);
  };

  const fetchUsers = async () => {
    const { data } = await usersApi.getAll();
    if (data) setUsers(data);
  };

  useEffect(() => {
    fetchKeys();
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let response;
    if (isEditMode && selectedKeyId) {
      response = await keysApi.update(selectedKeyId, formData);
    } else {
      response = await keysApi.create(formData);
    }
    if (response.error) {
      toast({ title: 'Error', description: response.error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: isEditMode ? 'Key updated' : 'Key created' });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedKeyId(null);
      setFormData({ key_uid: '', user_id: '', label: '' });
      fetchKeys();
    }
  };

  const handleEdit = (key: any) => {
    setFormData({ key_uid: key.key_uid, user_id: key.user_id, label: key.label });
    setSelectedKeyId(key.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await keysApi.delete(id);
    if (!error) {
      toast({ title: 'Success', description: 'Key deleted' });
      fetchKeys();
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Keys</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2" /> {isEditMode ? 'Edit Key' : 'Register Key'}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Key' : 'Register Key'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Key UID</Label>
                <Input
                  value={formData.key_uid}
                  onChange={(e) => setFormData({ ...formData, key_uid: e.target.value })}
                  required
                  disabled={isEditMode}
                />
              </div>
              <div>
                <Label>Owner</Label>
                <select
                  className="w-full border p-2"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                >
                  <option value="">Select user</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {keys.map((key) => (
          <Card key={key.id}>
            <CardHeader className="flex justify-between">
              <div>
                <CardTitle>{key.owner || 'No Owner'}</CardTitle>
                <p className="text-sm text-muted">{key.label}</p>
              </div>
              <StatusBadge status={key.status} />
            </CardHeader>
            <CardContent>
              <p className="font-mono">{key.key_uid}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => handleEdit(key)}>
                  <Edit className="mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(key.id)}>
                  <Trash2 className="mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Keys;





// import { useEffect, useState } from 'react';
// import { Plus, Trash2, CreditCard, Edit } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { StatusBadge } from '@/components/StatusBadge';
// import { useToast } from '@/hooks/use-toast';
// import { keysApi, usersApi } from '@/lib/api';

// const Keys = () => {
//   const [keys, setKeys] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
//   const [formData, setFormData] = useState({ key_uid: '', owner: '', label: '' });
//   const { toast } = useToast();

//   // Fetch keys
//   const fetchKeys = async () => {
//     const { data } = await keysApi.getAll();
//     if (data) setKeys(data);
//   };

//   // Fetch users for dropdown
//   const fetchUsers = async () => {
//     const { data } = await usersApi.getAll();
//     if (data) setUsers(data);
//   };

//   useEffect(() => {
//     fetchKeys();
//     fetchUsers();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     let response;
//     if (isEditMode && selectedKeyId) {
//       response = await keysApi.update(selectedKeyId, formData);
//     } else {
//       response = await keysApi.create(formData);
//     }

//     if (response.error) {
//       toast({ title: 'Error', description: response.error, variant: 'destructive' });
//     } else {
//       toast({ title: 'Success', description: isEditMode ? 'Key updated successfully' : 'Key registered successfully' });
//       setIsDialogOpen(false);
//       setFormData({ key_uid: '', owner: '', label: '' });
//       setIsEditMode(false);
//       setSelectedKeyId(null);
//       fetchKeys();
//     }
//   };

//   const handleDelete = async (id: string) => {
//     const { error } = await keysApi.delete(id);
    
//     if (error) {
//       toast({ title: 'Error', description: error, variant: 'destructive' });
//     } else {
//       toast({ title: 'Success', description: 'Key deleted successfully' });
//       fetchKeys();
//     }
//   };

//   const handleEdit = (key: any) => {
//     setFormData({ key_uid: key.key_uid, owner: key.owner, label: key.label });
//     setSelectedKeyId(key.id);
//     setIsEditMode(true);
//     setIsDialogOpen(true);
//   };

//   return (
//     <div className="space-y-6 p-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Keys</h1>
//           <p className="text-muted-foreground">Manage access keys and credentials</p>
//         </div>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               {isEditMode ? 'Edit Key' : 'Register Key'}
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>{isEditMode ? 'Edit Key' : 'Register New Key'}</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="key_uid">Key UID</Label>
//                 <Input
//                   id="key_uid"
//                   placeholder="A1B2C3D4"
//                   value={formData.key_uid}
//                   onChange={(e) => setFormData({ ...formData, key_uid: e.target.value })}
//                   required
//                   disabled={isEditMode} // Prevent changing UID
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="owner">Owner</Label>
//                 <select
//                   id="owner"
//                   value={formData.owner}
//                   onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
//                   className="w-full border rounded p-2"
//                   required
//                 >
//                   <option value="">Select user</option>
//                   {users.map((user) => (
//                     <option key={user.id} value={user.name}>{user.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="label">Label</Label>
//                 <Input
//                   id="label"
//                   placeholder="Employee Badge"
//                   value={formData.label}
//                   onChange={(e) => setFormData({ ...formData, label: e.target.value })}
//                 />
//               </div>
//               <Button type="submit" className="w-full">{isEditMode ? 'Update Key' : 'Register Key'}</Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {keys.map((key) => (
//           <Card key={key.id} className="shadow-card transition-all hover:shadow-lg">
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-accent">
//                     <CreditCard className="h-6 w-6 text-white" />
//                   </div>
//                   <div className="space-y-1">
//                     <CardTitle className="text-base">{key.owner}</CardTitle>
//                     <p className="text-xs text-muted-foreground">{key.label}</p>
//                   </div>
//                 </div>
//                 <StatusBadge status={key.status || 'active'} />
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="rounded-lg bg-muted/30 p-3">
//                 <div className="text-xs text-muted-foreground">Key UID</div>
//                 <div className="font-mono text-sm font-semibold text-foreground">{key.key_uid}</div>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => handleEdit(key)}
//                 >
//                   <Edit className="mr-2 h-3 w-3" />
//                   Edit Key
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => handleDelete(key.id)}
//                 >
//                   <Trash2 className="mr-2 h-3 w-3" />
//                   Revoke Key
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Keys;

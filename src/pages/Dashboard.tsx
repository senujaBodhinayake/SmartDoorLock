import { useEffect, useState } from 'react';
import { DoorOpen, Key, Users, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { doorsApi, keysApi, usersApi } from '@/lib/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    doors: 0,
    keys: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [doorsRes, keysRes, usersRes] = await Promise.all([
        doorsApi.getAll(),
        keysApi.getAll(),
        usersApi.getAll(),
      ]);

      setStats({
        doors: doorsRes.data?.length || 0,
        keys: keysRes.data?.length || 0,
        users: usersRes.data?.length || 0,
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Doors',
      value: stats.doors,
      icon: DoorOpen,
      gradient: 'bg-gradient-primary',
    },
    {
      title: 'Active Keys',
      value: stats.keys,
      icon: Key,
      gradient: 'bg-gradient-accent',
    },
    {
      title: 'Users',
      value: stats.users,
      icon: Users,
      gradient: 'bg-primary',
    },
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your access control center</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title} className="shadow-card transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.gradient}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="font-semibold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">
                No recent access events to display
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Connection</span>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Devices Online</span>
                <span className="text-sm font-semibold text-foreground">{stats.doors}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

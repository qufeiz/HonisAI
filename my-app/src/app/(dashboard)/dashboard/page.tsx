import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Users, Clock, CheckCircle2, TrendingUp, PhoneCall } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your AI calling performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Calls"
          value="341"
          change="+12% from last month"
          trend="up"
          icon={Phone}
        />
        <KPICard
          title="Contacts Reached"
          value="52"
          change="+8% from last month"
          trend="up"
          icon={Users}
        />
        <KPICard
          title="Avg Call Duration"
          value="52s"
          change="-3% from last month"
          trend="down"
          icon={Clock}
        />
        <KPICard
          title="Connection Rate"
          value="77.2%"
          change="+5.3% from last month"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Call Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Call Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                Chart visualization (integrate with chart library)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Call Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Transfer Successful</span>
                </div>
                <span className="text-sm font-medium">101 (29.6%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-sm">Transfer Attempted</span>
                </div>
                <span className="text-sm font-medium">87 (25.5%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Appointment Set</span>
                </div>
                <span className="text-sm font-medium">183 (53.7%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-400" />
                  <span className="text-sm">Not Reached</span>
                </div>
                <span className="text-sm font-medium">120 (35.2%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Sarah Wilson",
                action: "Transfer successful",
                time: "2 minutes ago",
              },
              {
                name: "Mike Johnson",
                action: "Appointment set",
                time: "15 minutes ago",
              },
              {
                name: "Emily Davis",
                action: "Callback requested",
                time: "1 hour ago",
              },
              {
                name: "Robert Garcia",
                action: "Voicemail left",
                time: "2 hours ago",
              },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <PhoneCall className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

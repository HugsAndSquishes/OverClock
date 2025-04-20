import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dummyData = [
  { name: "Alice", hours: 42 },
  { name: "Bob", hours: 38 },
  { name: "Charlie", hours: 36 },
  { name: "Dana", hours: 34 },
  { name: "Eli", hours: 30 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Clock In / Out</h2>
                <div className="flex items-center space-x-2">
                  <Button>Clock In</Button>
                  <Button variant="outline">Clock Out</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Attendance Overview</h2>
                <ul className="list-disc ml-5 text-sm">
                  <li>95% on-time rate</li>
                  <li>3 missed clock-ins</li>
                  <li>7 late entries</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Team Attendance</h2>
              <Input placeholder="Search employee..." className="mb-4" />
              <p className="text-sm text-muted-foreground">(Table of team punch-in/out data goes here)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Leaderboard (Hours Worked)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dummyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
                <Button className="w-full">Go to User Management</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">Generate Reports</h2>
                <Button className="w-full" variant="outline">Download Report</Button>
              </CardContent>
            </Card>4
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

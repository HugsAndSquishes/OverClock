"use client";

import Link from "next/link";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white h-screen p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/admin-dashboard/attendance-management" className="hover:bg-slate-700 p-2 rounded">
          Attendance Management
        </Link>
        <Link href="/admin-dashboard/employee-management" className="hover:bg-slate-700 p-2 rounded">
          Employee Management
        </Link>
        <Link href="/admin-dashboard/team-management" className="hover:bg-slate-700 p-2 rounded">
          Team Management
        </Link>
        <Link href="/admin-dashboard/leaderboard-management" className="hover:bg-slate-700 p-2 rounded">
          Leaderboard Management
        </Link>
      </nav>
    </aside>
  );
}

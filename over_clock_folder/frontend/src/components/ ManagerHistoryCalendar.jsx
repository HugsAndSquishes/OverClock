// src/components/ManagerHistoryCalendar.jsx
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function ManagerHistoryCalendar() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetch(`${API}/api/attendance/history/`)
      .then((res) => res.json())
      .then((data) =>
        setEvents(
          data.map((rec) => ({
            title: `${rec.employee_name} - ${rec.status}`,
            start: new Date(rec.date),
            end: new Date(rec.date),
            allDay: true,
          }))
        )
      )
      .catch((err) => console.error("Attendance fetch error:", err));
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="p-8 w-full max-w-20xl mx-4 bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-[#c98c52] mb-6">
          Employee Attendance History</h2>


        {/* Calendar */}
        <div className="h-[70vh]">
          <Calendar
            localizer={localizer}
            events={events}
            date={currentDate}
            onNavigate={setCurrentDate}
            defaultView="month"
            views={["month"]}
            toolbar
            className="rbc-alternate"
          />
        </div>
      </div>
    </div>
  );
}
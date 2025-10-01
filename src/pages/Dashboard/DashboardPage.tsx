'use client';

import React from "react";
import DashboardSkeleton from "@/components/ui/skeleton/dashboard-skeleton";
import {
  Calendar,
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  ChevronRight,
  Building,
  MapPin,
  Clock,
  Star,
  Award,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/custom-button";
import { Badge } from "@/components/ui/badge";

// Enhanced dummy data for event-company management
const dashboardData = {
  data: {
    total_events: 45,
    active_events: 12,
    upcoming_events: 8,
    total_companies: 180,
    participating_companies: 95,
    pending_applications: 15,
    total_revenue: 450000,
    monthly_revenue: 85000,
    booth_occupancy: 78, // percentage
    average_participation_fee: 2500,
    top_events: [
      {
        _id: "event_456",
        title: "Tech Innovation Summit 2024",
        participating_companies: 35,
        total_booths: 50,
        revenue: 87500,
        status: "active",
        startAt: "2024-12-25T09:00:00Z",
      },
      {
        _id: "event_789",
        title: "Digital Transformation Expo",
        participating_companies: 28,
        total_booths: 40,
        revenue: 70000,
        status: "upcoming",
        startAt: "2025-01-15T10:00:00Z",
      },
      {
        _id: "event_123",
        title: "AI & Machine Learning Conference",
        participating_companies: 22,
        total_booths: 30,
        revenue: 55000,
        status: "active",
        startAt: "2024-12-18T14:00:00Z",
      },
      {
        _id: "event_321",
        title: "Startup Showcase 2024",
        participating_companies: 18,
        total_booths: 25,
        revenue: 45000,
        status: "upcoming",
        startAt: "2025-02-10T09:00:00Z",
      },
    ],
    recent_company_applications: [
      {
        _id: "app_1",
        company_name: "InnovateTech Solutions",
        event_title: "Tech Innovation Summit 2024",
        booth_preference: "Premium Zone",
        participation_fee: 3000,
        status: "pending",
        applied_at: "2024-12-01T10:25:00Z",
      },
      {
        _id: "app_2",
        company_name: "DataFlow Analytics",
        event_title: "AI & ML Conference",
        booth_preference: "Innovation Hub",
        participation_fee: 2500,
        status: "approved",
        applied_at: "2024-12-01T09:15:00Z",
      },
      {
        _id: "app_3",
        company_name: "CloudSync Technologies",
        event_title: "Digital Transformation Expo",
        booth_preference: "Main Hall",
        participation_fee: 2800,
        status: "pending",
        applied_at: "2024-12-01T08:45:00Z",
      },
      {
        _id: "app_4",
        company_name: "NextGen Robotics",
        event_title: "Tech Innovation Summit 2024",
        booth_preference: "Demo Area",
        participation_fee: 3500,
        status: "approved",
        applied_at: "2024-11-30T16:30:00Z",
      },
    ],
  },
};

// format ISO → "2m ago"
function timeAgo(isoDate: string) {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return date.toLocaleDateString();
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick: () => void;
  subtitle?: string;
}> = ({ title, value, icon, color, bgColor, onClick, subtitle }) => (
  <div
    onClick={onClick}
    className={`${bgColor} dark:bg-gray-800 rounded-xl px-6 py-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer relative overflow-hidden group`}
  >
    {/* Background Icon */}
    <div className="absolute top-1 right-1 w-20 h-20 opacity-10 transform rotate-12">
      {React.cloneElement(icon as React.ReactElement, {
        className: `w-full h-full ${color}`,
      })}
    </div>

    <div className="flex items-start justify-between relative z-10">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-3">
          <div className={color}>{icon}</div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const EventRow: React.FC<{
  event: {
    _id: string;
    title: string;
    participating_companies: number;
    total_booths: number;
    revenue: number;
    status: string;
    startAt: string;
  };
  rank: number;
}> = ({ event, rank }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Active",
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      upcoming: {
        label: "Upcoming",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      },
      completed: {
        label: "Completed",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200">
      <td className="px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        #{rank}
      </td>
      <td className="px-6 py-3">
        <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
          {event.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(event.startAt).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
          <Building className="w-3.5 h-3.5 text-purple-500" />
          <span>{event.participating_companies}/{event.total_booths}</span>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
          ${event.revenue.toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-3">
        {getStatusBadge(event.status)}
      </td>
    </tr>
  );
};

const ApplicationRow: React.FC<{
  application: {
    _id: string;
    company_name: string;
    event_title: string;
    booth_preference: string;
    participation_fee: number;
    status: string;
    applied_at: string;
  };
}> = ({ application }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Award className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "rejected":
        return <MapPin className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: {
        label: "Approved",
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      rejected: {
        label: "Rejected",
        className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="flex justify-between items-start p-3 rounded-lg transition-all duration-200 hover:shadow-sm bg-gray-50 dark:bg-gray-700/30 border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
      {/* Left: Icon + Text */}
      <div className="flex items-start space-x-3 flex-1 min-w-0">
        <div className="p-1.5 rounded-md bg-white dark:bg-gray-600">
          {getStatusIcon(application.status)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {application.company_name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {application.event_title} • {application.booth_preference}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
            ${application.participation_fee.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Right: Status + Time */}
      <div className="flex flex-col items-end space-y-1">
        {getStatusBadge(application.status)}
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {timeAgo(application.applied_at)}
        </p>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data } = dashboardData;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const metrics = [
    {
      title: "Total Events",
      value: data.total_events,
      subtitle: `${data.active_events} active, ${data.upcoming_events} upcoming`,
      icon: <Calendar className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      path: "/events",
    },
    {
      title: "Registered Companies",
      value: data.total_companies,
      subtitle: `${data.participating_companies} participating`,
      icon: <Building className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      path: "/companies",
    },
    {
      title: "Pending Applications",
      value: data.pending_applications,
      subtitle: "Awaiting approval",
      icon: <Clock className="w-5 h-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      path: "/events",
    },
    {
      title: "Booth Occupancy",
      value: `${data.booth_occupancy}%`,
      subtitle: "Across all events",
      icon: <MapPin className="w-5 h-5" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      path: "/events",
    },
    {
      title: "Monthly Revenue",
      value: `$${data.monthly_revenue.toLocaleString()}`,
      subtitle: "From participation fees",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      path: "/analytics",
    },
    {
      title: "Total Revenue",
      value: `$${data.total_revenue.toLocaleString()}`,
      subtitle: `Avg. $${data.average_participation_fee}/company`,
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      path: "/analytics",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Event Management Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your events, company participation, and revenue performance
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outlined"
            onClick={() => router.push("/companies")}
          >
            <Building className="w-4 h-4 mr-2" />
            <span>Manage Companies</span>
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/events")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span>Manage Events</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <MetricCard
            key={i}
            {...metric}
            onClick={() => router.push(metric.path)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[400px]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Performing Events
              </h2>
            </div>
            <span
              onClick={() => router.push("/events")}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Companies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.top_events.map((event, i) => (
                  <EventRow
                    key={event._id}
                    event={event}
                    rank={i + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Company Applications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[400px]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h2>
            </div>
            <span
              onClick={() => router.push("/events")}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm font-medium cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          {/* Fixed height scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {data.recent_company_applications.map((application) => (
              <ApplicationRow
                key={application._id}
                application={application}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
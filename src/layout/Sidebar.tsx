import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

import {
  Building2,
  BarChart3,
  Settings,
  Home,
  Building,
  CreditCard,
  Mail,
  Receipt,
  Wrench,
  Calendar,
  Users,
  Network,
  MonitorCog,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: "permanent" | "temporary";
}

const menuItems = [
  {
    text: "Dashboard",
    icon: Home,
    path: "/dashboard",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    text: "Companies",
    icon: Building,
    path: "/companies",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    text: "Events",
    icon: Calendar,
    path: "/events",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    text: "Subscription",
    icon: CreditCard,
    path: "/subscription",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  variant = "temporary",
}) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <Link href="/dashboard">
        <div className="flex items-center space-x-3 cursor-pointer h-16 pl-8 border-b border-gray-200 dark:border-gray-700 ">
         
            <img
              src="/assets/exiby_logo.png"
              alt="ExiBy Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className=" text-gray-900 dark:text-white text-xl font-extrabold leading-tight mt-1">
                EXIBY
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Organization & Company
              </p>
           
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex-1 py-4 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.text}
              href={item.path}
              onClick={variant === "temporary" ? onClose : undefined}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-blue-100 dark:bg-gray-800 text-sky-900 dark:text-sky-200 shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-102"
              )}
            >
              <div
                className={`p-1.5 rounded-md transition-colors duration-200 ${
                  isActive
                    ? `${item.bgColor} dark:bg-gray-700`
                    : `${item.bgColor} dark:bg-gray-700 group-hover:${item.bgColor}`
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span
                className={`text-sm ${
                  isActive ? "font-semibold" : "font-normal"
                }`}
              >
                {item.text}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  if (variant === "permanent") {
    return <div className="w-80 flex-shrink-0">{sidebarContent}</div>;
  }

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-80 z-50 lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;

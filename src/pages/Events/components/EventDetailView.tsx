import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Globe, Clock, Users, DollarSign, ExternalLink, Info, Building, Star, Award, Zap, CircleCheck as CheckCircle, Circle as XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { useAppContext } from "@/contexts/AppContext";
import { _event_detail_view_api } from "@/DAL/eventAPI";
import { formatDateTime } from "@/utils/dateUtils.js";
import Button from "@/components/ui/custom-button";
import { mockParticipatingCompanies } from "@/mockData/participatingCompanies";

interface EventDetailViewProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({
  open,
  onClose,
  eventId,
}) => {
  const { darkMode } = useAppContext();
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [participatingCompanies] = useState(mockParticipatingCompanies);

  const getEventDetail = async (id: string) => {
    setLoading(true);
    const result = await _event_detail_view_api(id);
    if (result?.code === 200) {
      setEvent(result?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && eventId) {
      getEventDetail(eventId);
    }
  }, [open, eventId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: {
        label: "Published",
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      },
      draft: {
        label: "Draft",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        icon: <Clock className="w-3 h-3 mr-1" />
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        icon: <XCircle className="w-3 h-3 mr-1" />
      },
      completed: {
        label: "Completed",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge className={`text-xs px-3 py-1 ${config.className}`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getVenueIcon = (type: string) => {
    switch (type) {
      case "virtual":
        return <Globe className="w-4 h-4 text-purple-500" />;
      case "hybrid":
        return <Zap className="w-4 h-4 text-indigo-500" />;
      default:
        return <MapPin className="w-4 h-4 text-blue-500" />;
    }
  };

  const getVenueTypeBadge = (type: string) => {
    const typeConfig = {
      physical: {
        label: "Physical",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      },
      virtual: {
        label: "Virtual",
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      },
      hybrid: {
        label: "Hybrid",
        className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
      }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.physical;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <CustomDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <CustomDialogTitle onClose={onClose}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Loading Event Details
              </h1>
            </div>
          </div>
        </CustomDialogTitle>
        <CustomDialogContent dividers>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    );
  }

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <CustomDialogTitle onClose={onClose}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {event?.title || "Event Details"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Organized by {event?.orgn_user?.name || "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(event?.status || "draft")}
            {getVenueTypeBadge(event?.venue?.type || "physical")}
          </div>
        </div>
      </CustomDialogTitle>

      <CustomDialogContent dividers>
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {event?.current_attendees || 0}/{event?.max_attendees || 0}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Attendees</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-green-900 dark:text-green-100">
                    {event?.isPaidEvent && event?.ticketPrice > 0 
                      ? `$${event.ticketPrice}` 
                      : "Free"}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">Ticket Price</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                    {participatingCompanies.length}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">Companies</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                    {event?.startAt && event?.endAt
                      ? Math.ceil(
                          (new Date(event.endAt).getTime() -
                            new Date(event.startAt).getTime()) /
                            (1000 * 60 * 60)
                        ) + "h"
                      : "-"}
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">Duration</div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-semibold">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Event Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {event?.description ? (
                  <div 
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: event.description 
                    }} 
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No description provided
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Schedule Information */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Clock className="w-5 h-5 mr-2 text-purple-500" />
                  Schedule & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Event Start
                      </span>
                    </div>
                    <span className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                      {event?.startAt ? formatDateTime(event.startAt) : "Not set"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900 dark:text-green-100">
                        Event End
                      </span>
                    </div>
                    <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                      {event?.endAt ? formatDateTime(event.endAt) : "Not set"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900 dark:text-red-100">
                        Registration Deadline
                      </span>
                    </div>
                    <span className="text-sm text-red-800 dark:text-red-200 font-medium">
                      {event?.registration_deadline ? formatDateTime(event.registration_deadline) : "Not set"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Information */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  {getVenueIcon(event?.venue?.type)}
                  <span className="ml-2">Venue Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                  {getVenueTypeBadge(event?.venue?.type || "physical")}
                  {event?.is_public ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <Globe className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                      Private
                    </Badge>
                  )}
                </div>

                {(event?.venue?.type === "physical" || event?.venue?.type === "hybrid") && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Physical Location
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-1">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {event?.venue?.address || "Address not provided"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event?.venue?.city && event?.venue?.state && event?.venue?.country
                          ? `${event.venue.city}, ${event.venue.state}, ${event.venue.country}`
                          : "Location details not provided"}
                      </p>
                      {event?.venue?.postal_code && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.venue.postal_code}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {(event?.venue?.type === "virtual" || event?.venue?.type === "hybrid") && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Virtual Access
                    </h4>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                          Platform: {event?.venue?.platform || "Not specified"}
                        </span>
                      </div>
                      {event?.venue?.virtual_link && (
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                          <a
                            href={event.venue.virtual_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-700 dark:text-purple-300 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Join Virtual Event
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Participating Companies */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center text-lg font-semibold">
                  <Building className="w-5 h-5 mr-2 text-orange-500" />
                  Participating Companies
                  <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                    {participatingCompanies.length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {participatingCompanies.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No companies participating yet</p>
                  <p className="text-xs mt-1">Companies can register for booth spaces</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {participatingCompanies.map((company) => (
                    <div
                      key={company._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Building className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {company.company_name}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>Booth {company.booth.number}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Award className="w-3 h-3" />
                              <span>{company.booth.size}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs px-2 py-1 ${
                          company.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : company.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {company.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Settings & Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Event Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Event Type
                  </span>
                  <Badge className={event?.isPaidEvent 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  }>
                    {event?.isPaidEvent ? "Paid Event" : "Free Event"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Visibility
                  </span>
                  <Badge className={event?.is_public 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }>
                    <Globe className="w-3 h-3 mr-1" />
                    {event?.is_public ? "Public" : "Private"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Currency
                  </span>
                  <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                    {event?.currency || "USD"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Event Metadata */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Info className="w-5 h-5 mr-2 text-gray-500" />
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Event ID:</span>
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {event?._id || "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Slug:</span>
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {event?.slug || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {event?.createdAt ? formatDateTime(event.createdAt) : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {event?.updatedAt ? formatDateTime(event.updatedAt) : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Progress */}
          {event?.max_attendees > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg font-semibold">
                  <Users className="w-5 h-5 mr-2 text-indigo-500" />
                  Registration Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Current Registrations
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {event?.current_attendees || 0} / {event?.max_attendees || 0}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((event?.current_attendees || 0) / (event?.max_attendees || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0</span>
                    <span>
                      {Math.round(
                        ((event?.current_attendees || 0) / (event?.max_attendees || 1)) * 100
                      )}% filled
                    </span>
                    <span>{event?.max_attendees || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default EventDetailView;
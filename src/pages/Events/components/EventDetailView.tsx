import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Globe, Clock, Users, DollarSign, ExternalLink, Info, TriangleAlert as AlertTriangle } from "lucide-react";
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
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      },
      draft: {
        label: "Draft",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <Badge className={`text-xs px-2 py-1 ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <CustomDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <CustomDialogTitle onClose={onClose}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Loading Event Details
              </h1>
            </div>
          </div>
        </CustomDialogTitle>
        <CustomDialogContent dividers>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    );
  }

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <CustomDialogTitle onClose={onClose}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Event Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {event?.title || "Event Information"}
            </p>
          </div>
        </div>
      </CustomDialogTitle>

      <CustomDialogContent dividers>
        <div className="space-y-4">
          {/* Event Header */}
          <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {event?.title || "Event Title"}
            </h2>
            <div className="flex items-center justify-center space-x-4">
              {getStatusBadge(event?.status || "draft")}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {event?.category || "General"}
              </span>
            </div>
          </div>

          {/* Event Statistics */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-center">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="font-semibold text-sm">
                  {event?.max_attendees || 0}
                </div>
                <div className="text-xs text-gray-500">Max Attendees</div>
              </div>
              
              <div className="text-center">
                <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="font-semibold text-sm">
                  {event?.ticket_price && event.ticket_price > 0 
                    ? `$${event.ticket_price}` 
                    : "Free"}
                </div>
                <div className="text-xs text-gray-500">Ticket Price</div>
              </div>

              <div className="text-center">
                <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="font-semibold text-sm">
                  {event?.startAt && event?.endAt
                    ? Math.ceil(
                        (new Date(event.endAt).getTime() -
                          new Date(event.startAt).getTime()) /
                          (1000 * 60 * 60)
                      ) + "h"
                    : "-"}
                </div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
            </div>
          </div>

          {/* Event Information */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium">
                <Info className="w-4 h-4 mr-2 text-[#0077ED]" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
              <div className="space-y-3">
                <div>
                  <label className="block font-medium mb-1 text-gray-900 dark:text-white">Description</label>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {(() => {
                      const plainText = event?.description
                        ?.replace(/<[^>]+>/g, "")
                        .trim();
                      if (!plainText) return "No description";
                      return plainText.length > 100
                        ? `${plainText.substring(0, 100)}...`
                        : plainText;
                    })()}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center font-medium text-gray-900 dark:text-white">
                    Venue Address
                  </div>

                  {(event?.venue?.type === "physical" ||
                    event?.venue?.type === "hybrid") && (
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">{event?.venue?.address}</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {event?.venue?.city}, {event?.venue?.state},{" "}
                        {event?.venue?.country}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">{event?.venue?.postal_code}</div>
                    </div>
                  )}

                  {event?.venue?.type === "virtual" && (
                    <div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Globe className="w-4 h-4 mr-2" />
                        {event?.venue?.platform}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">{event?.venue?.link}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium">
                <Clock className="w-4 h-4 mr-2 text-[#0077ED]" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
              <div className="space-y-3">
                <div className="flex items-center mb-4">
                  <div className="pe-2 ps-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-medium text-sky-800 dark:text-sky-300">
                      Start:
                    </span>
                    <span className="text-xs text-sky-700 dark:text-sky-300">
                      {event?.startAt ? formatDateTime(event.startAt) : "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="pe-2 ps-2 py-1 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-800 dark:text-green-300">
                      End:
                    </span>
                    <span className="text-xs text-green-700 dark:text-green-300">
                      {event?.endAt ? formatDateTime(event.endAt) : "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="pe-2 ps-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-purple-800 dark:text-purple-300">
                      Registration Deadline:
                    </span>
                    <span className="text-xs text-purple-700 dark:text-purple-300">
                      {event?.registration_deadline ? formatDateTime(event.registration_deadline) : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participating Companies Summary */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium">
                <Users className="w-4 h-4 mr-2 text-[#0077ED]" />
                Participating Companies ({participatingCompanies.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {participatingCompanies.length === 0 ? (
                <div className="text-center py-3 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No companies participating yet</p>
                </div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {participatingCompanies.map((company) => (
                    <div
                      key={company._id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded flex items-center justify-center">
                          <Users className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                            {company.company_name}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>Booth: {company.booth.number}</span>
                            <span>Size: {company.booth.size}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`text-xs px-1.5 py-0.5 ${
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
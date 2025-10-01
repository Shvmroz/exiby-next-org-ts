"use client";

import React, { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  User,
  FileText,
  Download,
  Eye,
  DollarSign,
  Linkedin,
  Edit,
} from "lucide-react";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/ui/custom-button";
import { mockEventAttendees } from "@/mockData/eventAttendees";

interface EventAttendeesDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
}

const EventAttendeesDialog: React.FC<EventAttendeesDialogProps> = ({
  open,
  onClose,
  eventId,
  eventTitle,
}) => {
  const [activeTab, setActiveTab] = useState("confirmed");

  // Filter attendees by status
  const confirmedAttendees = mockEventAttendees.filter(attendee => attendee.registration.status === "confirmed");
  const pendingAttendees = mockEventAttendees.filter(attendee => attendee.registration.status === "pending");
  const cancelledAttendees = mockEventAttendees.filter(attendee => attendee.registration.status === "cancelled");

  const getCurrentAttendees = () => {
    switch (activeTab) {
      case "confirmed":
        return confirmedAttendees;
      case "pending":
        return pendingAttendees;
      case "cancelled":
        return cancelledAttendees;
      default:
        return confirmedAttendees;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "waived":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
            <FileText className="w-3 h-3 mr-1" />
            Waived
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      "Early Bird":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      Standard:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      VIP: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      Student:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      Speaker:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    };

    return (
      <Badge
        className={`${
          colors[type as keyof typeof colors] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        } text-xs`}
      >
        {type}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (amount === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      sx={{ height: "700px" }}
    >
      <CustomDialogTitle onClose={onClose}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Event Attendees
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {eventTitle}
              </p>
            </div>
          </div>
        </div>
      </CustomDialogTitle>

      <CustomDialogContent dividers className="space-y-4">
        {/* Tabs for different attendee statuses */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="confirmed" className="flex items-center space-x-2">
              <span>Confirmed</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
                {confirmedAttendees.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <span>Pending</span>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 text-xs">
                {pendingAttendees.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center space-x-2">
              <span>Cancelled</span>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-xs">
                {cancelledAttendees.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="confirmed" className="space-y-3">
            {confirmedAttendees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No confirmed attendees found</p>
              </div>
            ) : (
              confirmedAttendees.map((attendee) => (
              <Card
                key={attendee._id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header with Name and Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {attendee.attendee.name}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.job_title} •{" "}
                              {attendee.attendee.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(attendee.registration.status)}
                          {getTypeBadge(attendee.registration.type)}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.phone}
                            </span>
                          </div>
                          {attendee.attendee.linkedin && (
                            <div className="flex items-center space-x-2">
                              <Linkedin className="w-4 h-4 text-gray-400" />
                              <a
                                href={attendee.attendee.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Registered:{" "}
                              {formatDate(
                                attendee.registration.registration_date
                              )}
                            </span>
                          </div>
                          {attendee.registration.check_in_time && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Checked in:{" "}
                                {formatDate(
                                  attendee.registration.check_in_time
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Ticket: {attendee.registration.ticket_number}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Payment Status
                            </span>
                          </div>
                          {getPaymentStatusBadge(attendee.payment.status)}
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Amount
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(
                              attendee.payment.amount,
                              attendee.payment.currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {pendingAttendees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No pending attendees found</p>
              </div>
            ) : (
              pendingAttendees.map((attendee) => (
              <Card
                key={attendee._id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header with Name and Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {attendee.attendee.name}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.job_title} •{" "}
                              {attendee.attendee.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(attendee.registration.status)}
                          {getTypeBadge(attendee.registration.type)}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.phone}
                            </span>
                          </div>
                          {attendee.attendee.linkedin && (
                            <div className="flex items-center space-x-2">
                              <Linkedin className="w-4 h-4 text-gray-400" />
                              <a
                                href={attendee.attendee.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Registered:{" "}
                              {formatDate(
                                attendee.registration.registration_date
                              )}
                            </span>
                          </div>
                          {attendee.registration.check_in_time && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Checked in:{" "}
                                {formatDate(
                                  attendee.registration.check_in_time
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Ticket: {attendee.registration.ticket_number}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Payment Status
                            </span>
                          </div>
                          {getPaymentStatusBadge(attendee.payment.status)}
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Amount
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(
                              attendee.payment.amount,
                              attendee.payment.currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-3">
            {cancelledAttendees.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No cancelled attendees found</p>
              </div>
            ) : (
              cancelledAttendees.map((attendee) => (
              <Card
                key={attendee._id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Header with Name and Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {attendee.attendee.name}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.job_title} •{" "}
                              {attendee.attendee.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(attendee.registration.status)}
                          {getTypeBadge(attendee.registration.type)}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {attendee.attendee.phone}
                            </span>
                          </div>
                          {attendee.attendee.linkedin && (
                            <div className="flex items-center space-x-2">
                              <Linkedin className="w-4 h-4 text-gray-400" />
                              <a
                                href={attendee.attendee.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Registered:{" "}
                              {formatDate(
                                attendee.registration.registration_date
                              )}
                            </span>
                          </div>
                          {attendee.registration.check_in_time && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                Checked in:{" "}
                                {formatDate(
                                  attendee.registration.check_in_time
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Ticket: {attendee.registration.ticket_number}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Payment Status
                            </span>
                          </div>
                          {getPaymentStatusBadge(attendee.payment.status)}
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Amount
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(
                              attendee.payment.amount,
                              attendee.payment.currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </TabsContent>
        </Tabs>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default EventAttendeesDialog;

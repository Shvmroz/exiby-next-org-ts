'use client';

import React, { useState, useEffect } from "react";
import { Calendar, Search, Filter, Plus, Download, CreditCard as Edit, Trash2, MapPin, Globe, Users, Building, AlertTriangle } from "lucide-react";
import CustomTable, {
  TableHeader,
  MenuOption,
} from "@/components/ui/custom-table";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import CustomDrawer from "@/components/ui/custom-drawer";
import { Input } from "@/components/ui/input";
import CsvExportDialog from "@/components/ui/csv-export-dialog";
import { Badge } from "@/components/ui/badge";
import TableSkeleton from "@/components/ui/skeleton/table-skeleton";
import { useSnackbar } from "notistack";
import EventsAddEditDialog from "./components/EventsAddEditDialog";
import EventDetailView from "./components/EventDetailView";
import EventFilters from "./components/EventFilters";
import ParticipatingCompaniesDialog from "./components/ParticipatingCompaniesDialog";
import EventAttendeesDialog from "./components/EventAttendeesDialog";
import EventCancellationDialog from "./components/EventCancellationDialog";
import {
  _add_event_api,
  _edit_event_api,
  _events_list_api,
} from "@/DAL/eventAPI";
import { formatDate, formatDateTime } from "@/utils/dateUtils.js";
import Button from "@/components/ui/custom-button";

export interface Event {
  _id: string;
  title: string;
  description: string;
  slug: string;
  status: "draft" | "published" | "archived"; // adjust as needed
  current_attendees: number;
  max_attendees: number;
  registration_deadline: string;
  createdAt: string;
  updatedAt: string;
  orgn_user: {
    _id: string;
    name: string;
  };
}

const EventsPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rowData, setRowData] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [detailView, setDetailView] = useState(false);
  const [participatingCompaniesDialog, setParticipatingCompaniesDialog] = useState(false);
  const [attendeesDialog, setAttendeesDialog] = useState(false);
  const [cancellationDialog, setCancellationDialog] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [cancellationLoading, setCancellationLoading] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [paidOnlyFilter, setPaidOnlyFilter] = useState(false);
  const [publicOnlyFilter, setPublicOnlyFilter] = useState(false);
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  // CSV Export state
  const [exportDialog, setExportDialog] = useState(false);

  // Local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filtersApplied, setFiltersApplied] = useState({
    search: "",
    sort_by: "updatedAt",
    sort_order: "desc",
    page: 1,
    limit: 50,
  });

  // Table helpers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Load events
  const getListEvents = async (searchQuery = "", filters = {}) => {
    setLoading(true);

    const result = await _events_list_api(
      currentPage,
      rowsPerPage,
      searchQuery,
      filters
    );
    if (result?.code === 200) {
      setEvents(result.data?.events as Event[]);
      setTotalCount(result.data.total_count || 0);
      setTotalPages(result.data.total_pages || 1);
      setFiltersApplied({
        search: "",
        sort_by: "updatedAt",
        sort_order: "desc",
        page: 1,
        limit: 50,
        ...result.data.filters_applied,
      });
      setLoading(false);
    } else {
      enqueueSnackbar((result as any)?.message || "Failed to load events", {
        variant: "error",
      });
      setEvents([]);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    getListEvents();
  }, [currentPage, rowsPerPage]);

  if (loading && events.length === 0) {
    return <TableSkeleton rows={8} columns={7} showFilters={true} />;
  }

  const handleEdit = (event: Event) => {
    setEditDialog(true);
    setRowData(event);
  };

  const handleDelete = (event: Event) => {
    setDeleteDialog(true);
    setRowData(event);
  };

  const handleConfirmDelete = async () => {
    if (!rowData?._id) return;

    setDeleteLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _delete_event_api(rowData._id);

      // Simulate API response
      const result = { code: 200, message: "Event deleted successfully" };

      if (result?.code === 200) {
        setEvents((prev) => prev.filter((event) => event._id !== rowData._id));
        setDeleteDialog(false);
        setRowData(null);
        enqueueSnackbar("Event deleted successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to delete event", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveEdit = async (data: Partial<Event>) => {
    if (!rowData?._id) return;

    setEditLoading(true);
    try {
      const result = await _edit_event_api(rowData._id, data);
      if (result?.code === 200) {
        setEditDialog(false);
        setRowData(null);
        setEvents((prev) =>
          prev.map((event) =>
            event._id === rowData._id ? { ...event, ...data } : event
          )
        );
        enqueueSnackbar("Event updated successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to update event", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddNewEvent = async (data: Partial<Event>) => {
    setAddLoading(true);
    try {
      const result = await _add_event_api(data);
      if (result?.code === 200) {
        setEvents((prev) => [result.data, ...prev]);
        setCreateDialog(false);
        enqueueSnackbar("Event created successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to create event", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setAddLoading(false);
    }
  };

  const handleRowClick = (event: Event) => {
    setDetailView(true);
    setRowData(event);
  };

  const handleParticipatingCompanies = (event: Event) => {
    setParticipatingCompaniesDialog(true);
    setRowData(event);
  };

  const handleAttendees = (event: Event) => {
    setAttendeesDialog(true);
    setRowData(event);
  };

  const handleCancelEvent = (event: Event) => {
    setCancellationDialog(true);
    setRowData(event);
  };

  const handleConfirmCancellation = async (cancellationData: any) => {
    if (!rowData?._id) return;

    setCancellationLoading(true);
    try {
      // TODO: Replace with actual API call
      // const result = await _cancel_event_api(rowData._id, cancellationData);

      // Simulate API response
      const result = { code: 200, message: "Event cancelled successfully" };

      if (result?.code === 200) {
        // Update event status to cancelled
        setEvents((prev) =>
          prev.map((event) =>
            event._id === rowData._id ? { ...event, status: "cancelled" as any } : event
          )
        );
        setCancellationDialog(false);
        setRowData(null);
        enqueueSnackbar("Event cancelled successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result?.message || "Failed to cancel event", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error cancelling event:", error);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    } finally {
      setCancellationLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    getListEvents(searchQuery);
  };

  // Filter functions
  const isDateRangeInvalid = Boolean(
    createdFrom && createdTo && new Date(createdTo) < new Date(createdFrom)
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (paidOnlyFilter) count++;
    if (publicOnlyFilter) count++;
    if (createdFrom || createdTo) count += 1;

    return count;
  };

  const handleClearFilters = () => {
    setStatusFilter("all");
    setPaidOnlyFilter(false);
    setPublicOnlyFilter(false);
    setCreatedFrom("");
    setCreatedTo("");
    setFilterDrawerOpen(false);
    getListEvents();
  };

  const handleApplyFilters = () => {
    const filters: { [key: string]: string } = {};

    if (statusFilter !== "all") filters.status = statusFilter;
    if (paidOnlyFilter) filters.paid_only = "true";
    if (publicOnlyFilter) filters.public_only = "true";
    if (createdFrom) filters.created_from = createdFrom;
    if (createdTo) filters.created_to = createdTo;

    //  Check if there are any applied filters
    const hasFilters =
      Object.keys(filters).length > 0 &&
      Object.values(filters).some((val) => val && val !== "");

    if (!hasFilters) {
      enqueueSnackbar("Please select at least one filter", {
        variant: "warning",
      });
      return;
    }

    getListEvents(searchQuery, filters);
    setFilterDrawerOpen(false);
  };

  const MENU_OPTIONS: MenuOption[] = [
    {
      label: "Participating Companies",
      action: handleParticipatingCompanies,
      icon: <Building className="w-4 h-4" />,
    },
    {
      label: "Event Attendees",
      action: handleAttendees,
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: "Edit",
      action: handleEdit,
      icon: <Edit className="w-4 h-4" />,
    },
    {
      label: "Cancel Event",
      action: handleCancelEvent,
      icon: <AlertTriangle className="w-4 h-4" />,
      variant: "warning",
    },
    {
      label: "Delete",
      action: handleDelete,
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: {
        label: "Published",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      draft: {
        label: "Draft",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      cancelled: {
        label: "Cancelled",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      },
      completed: {
        label: "Completed",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getVenueTypeBadge = (type: string) => {
    const typeConfig = {
      physical: {
        label: "Physical",
        className:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
        icon: <MapPin className="w-3 h-3 mr-1" />,
      },
      virtual: {
        label: "Virtual",
        className:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
        icon: <Globe className="w-3 h-3 mr-1" />,
      },
      hybrid: {
        label: "Hybrid",
        className:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
        icon: <Calendar className="w-3 h-3 mr-1" />,
      },
    };

    const config =
      typeConfig[type as keyof typeof typeConfig] || typeConfig.physical;

    return (
      <Badge className={config.className}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const TABLE_HEAD: TableHeader[] = [
    {
      key: "index",
      label: "#",
      renderData: (_row, rowIndex) => (
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {rowIndex !== undefined ? rowIndex + 1 : "-"}.
        </span>
      ),
    },
    {
      key: "event",
      label: "Event",
      renderData: (event) => (
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {event.title}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {(() => {
                const plainText = event?.description
                  ?.replace(/<[^>]+>/g, "")
                  .trim();
                if (!plainText) return "No description";
                return plainText.length > 50
                  ? `${plainText.substring(0, 50)}...`
                  : plainText;
              })()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "orgn_user",
      label: "Organization",
      renderData: (event) => (
        <div className="flex items-center space-x-2 mt-1">
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs">
            {event.orgn_user?.name || "Unknown Org"}
          </Badge>
        </div>
      ),
    },
    {
      key: "attendees",
      label: "Attendees",
      renderData: (event) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-gray-900 dark:text-white">
            {event.current_attendees}/{event.max_attendees}
          </span>
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Registration Deadline",
      renderData: (event) => (
        <div className="space-y-1">
          <div className="text-sm text-red-600 dark:text-red-400 font-medium">
            {formatDate(event.registration_deadline)}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (event) => getStatusBadge(event.status),
    },
    {
      key: "createdAt",
      label: "Created",
      renderData: (event) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatDateTime(event.createdAt)}
        </span>
      ),
    },
    {
      key: "action",
      label: "",
      type: "action",
      width: "w-12",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and monitor all events on your platform
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setExportDialog(true)}
            variant="outlined"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => setCreateDialog(true)}
            variant="contained"
            color="primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative w-full flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-24"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={searchQuery === ""}
                variant="outlined"
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setFilterDrawerOpen(true)}
              variant="outlined"
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getAppliedFiltersCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs px-2">
                  {getAppliedFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <CustomTable
        data={events}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={MENU_OPTIONS}
        custom_pagination={{
          total_count: totalCount,
          rows_per_page: rowsPerPage,
          page: currentPage,
          handleChangePage,
          onRowsPerPageChange,
        }}
        totalPages={totalPages}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="No events found"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog}
        onOpenChange={(open) => {
          setDeleteDialog(open);
          if (!open) setRowData(null);
        }}
        title="Delete Event"
        content={`Are you sure you want to delete "${rowData?.title}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Event Dialog (Create / Edit) */}
      <EventsAddEditDialog
        open={editDialog || createDialog}
        onOpenChange={(open) => {
          if (editDialog) {
            // closing edit dialog
            setEditDialog(open);
            if (!open) setRowData(null);
          } else {
            // closing create dialog
            setCreateDialog(open);
          }
        }}
        event={editDialog ? rowData : null} // pass event only in edit mode
        onSave={editDialog ? handleSaveEdit : handleAddNewEvent}
        loading={editDialog ? editLoading : addLoading}
      />

      {/* Event Detail View */}

      {detailView && rowData && (
        <EventDetailView
          open={detailView}
          onClose={() => {
            setDetailView(false);
            setRowData(null);
          }}
          eventId={rowData._id}
        />
      )}

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={exportDialog}
        onOpenChange={setExportDialog}
        exportType="events"
        title="Events"
      />

      {/* Filter Drawer */}
      <CustomDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filter Events"
        onClear={handleClearFilters}
        onFilter={handleApplyFilters}
        loading={filterLoading}
        applyButtonDisabled={isDateRangeInvalid}
      >
        <EventFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          paidOnlyFilter={paidOnlyFilter}
          setPaidOnlyFilter={setPaidOnlyFilter}
          publicOnlyFilter={publicOnlyFilter}
          setPublicOnlyFilter={setPublicOnlyFilter}
        />
      </CustomDrawer>

      {/* Participating Companies Dialog */}
      <ParticipatingCompaniesDialog
        open={participatingCompaniesDialog}
        onClose={() => {
          setParticipatingCompaniesDialog(false);
          setRowData(null);
        }}
        eventId={rowData?._id || ""}
        eventTitle={rowData?.title}
      />

      {/* Event Attendees Dialog */}
      <EventAttendeesDialog
        open={attendeesDialog}
        onClose={() => {
          setAttendeesDialog(false);
          setRowData(null);
        }}
        eventId={rowData?._id || ""}
        eventTitle={rowData?.title}
      />

      {/* Event Cancellation Dialog */}
      <EventCancellationDialog
        open={cancellationDialog}
        onOpenChange={(open) => {
          setCancellationDialog(open);
          if (!open) setRowData(null);
        }}
        onCancel={handleConfirmCancellation}
        loading={cancellationLoading}
        event={rowData}
      />
    </div>
  );
};

export default EventsPage;

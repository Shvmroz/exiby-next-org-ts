import React, { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/ui/searchable-select";
import StatusSwitch from "@/components/ui/status-switch";
import { Switch } from "@/components/ui/switch";
import { Save, X, Calendar, Building, Plus, Trash2 } from "lucide-react";
import { _organizations_list_api } from "@/DAL/organizationAPI";
import { _companies_list_api } from "@/DAL/companyAPI";
import { useSnackbar } from "notistack";
import QuillEditor from "@/components/ui/quillEditor/quillEditor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/custom-button";

interface EventsAddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: any) => void;
  loading?: boolean;
  event?: any | null;
}

const venueTypes = [
  { value: "physical", label: "Physical" },
  { value: "virtual", label: "Virtual" },
  { value: "hybrid", label: "Hybrid" },
];
const statuses = [
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
];
const platforms = [
  { value: "Zoom", label: "Zoom" },
  { value: "Google Meet", label: "Google Meet" },
  { value: "Microsoft Teams", label: "Microsoft Teams" },
  { value: "WebEx", label: "WebEx" },
  { value: "Other", label: "Other" },
];

const EventsAddEditDialog: React.FC<EventsAddEditDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
  event,
}) => {
  const { darkMode } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const isEdit = Boolean(event);
  const [organizations, setOrganizations] = useState<Array<any>>([]);
  const [companies, setCompanies] = useState<Array<any>>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Array<any>>([]);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companyDetails, setCompanyDetails] = useState({
    booth_number: "",
    booth_size: "3x3",
    booth_location: "",
    participation_fee: "",
    facilities: [] as string[],
    special_requirements: "",
    auto_approve: false,
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    venue: {
      type: "physical",
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      virtual_link: "",
      platform: "",
    },
    status: "draft",
    ticketPrice: "",
    currency: "USD",
    isPaidEvent: false,
    max_attendees: "",
    registration_deadline: "",
    is_public: true,
    organization_id: "", // set when adding new event
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      // Edit mode payload
      const reqData = {
        title: formData.title,
        description: formData.description,
        startAt: formData.startAt ? formData.startAt + ":00.000Z" : "",
        endAt: formData.endAt ? formData.endAt + ":00.000Z" : "",
        registration_deadline: formData.registration_deadline
          ? formData.registration_deadline + ":00.000Z"
          : "",
        venue: formData.venue,
        status: formData.status,
        ticketPrice:
          formData.ticketPrice === "" ? 0 : Number(formData.ticketPrice),
        currency: formData.currency,
        isPaidEvent: formData.isPaidEvent,
        max_attendees:
          formData.max_attendees === "" ? 0 : Number(formData.max_attendees),
        is_public: formData.is_public,
        organization_id: formData.organization_id,
        participating_companies: selectedCompanies,
      };
      console.log("Update Event Payload:", reqData);
      onSave(reqData);
    } else {
      // Create mode payload
      const reqData = {
        title: formData.title,
        description: formData.description,
        startAt: formData.startAt ? formData.startAt + ":00.000Z" : "",
        endAt: formData.endAt ? formData.endAt + ":00.000Z" : "",
        registration_deadline: formData.registration_deadline
          ? formData.registration_deadline + ":00.000Z"
          : "",
        venue: formData.venue,
        status: formData.status,
        ticketPrice:
          formData.ticketPrice === "" ? 0 : Number(formData.ticketPrice),
        currency: formData.currency,
        isPaidEvent: formData.isPaidEvent,
        max_attendees:
          formData.max_attendees === "" ? 0 : Number(formData.max_attendees),
        is_public: formData.is_public,
        organization_id: formData.organization_id,
        participating_companies: selectedCompanies,
      };
      console.log("Create Event Payload:", reqData);
      onSave(reqData);
    }
  };

  const getOrgList = async () => {
    const result = await _organizations_list_api();
    if (result?.code === 200) {
      setOrganizations(result.data.organizations || []);
    } else {
      console.log(result?.message || "Failed to load organizations");
    }
  };

  const getCompaniesList = async () => {
    const result = await _companies_list_api(1, 100);
    if (result?.code === 200) {
      setCompanies(result.data.companies || []);
    } else {
      console.log(result?.message || "Failed to load companies");
    }
  };
  // Prefill in edit mode
  useEffect(() => {
    if (event) {
      console.log("Event to edit:", event);
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startAt: event.startAt ? event.startAt.slice(0, 16) : "",
        endAt: event.endAt ? event.endAt.slice(0, 16) : "",
        venue: event.venue || {
          type: "physical",
          address: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          virtual_link: "",
          platform: "",
        },
        status: event.status || "draft",
        ticketPrice: event.ticketPrice ?? "",
        currency: "USD",
        isPaidEvent: event.isPaidEvent ?? false,
        max_attendees: event.max_attendees ?? "",
        registration_deadline: event.registration_deadline
          ? event.registration_deadline.slice(0, 16)
          : "",
        is_public: event.is_public ?? true,
        organization_id: (event as any).organization_id || "", // for new events, can be set on add
      });
      // Load existing participating companies if in edit mode
      setSelectedCompanies(event.participating_companies || []);
    } else {
      setFormData({
        title: "",
        description: "",
        startAt: "",
        endAt: "",
        venue: {
          type: "physical",
          address: "",
          city: "",
          state: "",
          country: "",
          postal_code: "",
          virtual_link: "",
          platform: "",
        },
        status: "draft",
        ticketPrice: "",
        currency: "USD",
        isPaidEvent: false,
        max_attendees: "",
        registration_deadline: "",
        is_public: true,
        organization_id: "", // set when adding
      });
      setSelectedCompanies([]);
    }
  }, [event, open]);

  useEffect(() => {
    if (open && !event) {
      getOrgList();
      getCompaniesList();
    }
    if (open && event) {
      getCompaniesList();
    }
  }, [open]);

  const updateVenue = (field: string, value: string) => {
    setFormData({
      ...formData,
      venue: {
        ...formData.venue,
        [field]: value,
      },
    });
  };

  const handleAddCompany = () => {
    if (!selectedCompanyId) {
      enqueueSnackbar("Please select a company", { variant: "warning" });
      return;
    }

    const company = companies.find(c => c._id === selectedCompanyId);
    if (!company) {
      enqueueSnackbar("Company not found", { variant: "error" });
      return;
    }

    // Check if company is already added
    if (selectedCompanies.some(c => c.company_id === selectedCompanyId)) {
      enqueueSnackbar("Company is already participating in this event", { variant: "warning" });
      return;
    }

    const newParticipation = {
      _id: `participation_${Date.now()}`,
      company_id: selectedCompanyId,
      company_name: company.orgn_user?.name || "Unknown Company",
      booth: {
        number: companyDetails.booth_number,
        size: companyDetails.booth_size,
        location: companyDetails.booth_location,
        facilities: companyDetails.facilities,
      },
      participation_fee: Number(companyDetails.participation_fee) || 0,
      auto_approve: companyDetails.auto_approve,
      special_requirements: companyDetails.special_requirements,
      status: companyDetails.auto_approve ? "approved" : "pending",
    };

    setSelectedCompanies(prev => [...prev, newParticipation]);
    
    // Reset form
    setSelectedCompanyId("");
    setCompanyDetails({
      booth_number: "",
      booth_size: "3x3",
      booth_location: "",
      participation_fee: "",
      facilities: [],
      special_requirements: "",
      auto_approve: false,
    });
    setShowAddCompany(false);
    
    enqueueSnackbar(`${company.orgn_user?.name} added to event`, { variant: "success" });
  };

  const handleRemoveCompany = (companyId: string) => {
    const company = selectedCompanies.find(c => c.company_id === companyId);
    setSelectedCompanies(prev => prev.filter(c => c.company_id !== companyId));
    enqueueSnackbar(`${company?.company_name} removed from event`, { variant: "success" });
  };

  const handleFacilityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
      e.preventDefault();
      const newFacility = e.currentTarget.value.trim();
      if (!companyDetails.facilities.includes(newFacility)) {
        setCompanyDetails({
          ...companyDetails,
          facilities: [...companyDetails.facilities, newFacility],
        });
      }
      e.currentTarget.value = "";
    }
  };

  const removeFacility = (facility: string) => {
    setCompanyDetails({
      ...companyDetails,
      facilities: companyDetails.facilities.filter(f => f !== facility),
    });
  };
  const handleBackdropClick = (event: React.MouseEvent) => {
    event.preventDefault();
    enqueueSnackbar("Use cancel button to close dialog", {
      variant: "info",
    });
  };

  return (
    <CustomDialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="lg"
      fullWidth
    >
      <CustomDialogTitle onClose={() => onOpenChange(false)}>
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[#0077ED]" />
          {isEdit ? "Edit Event" : "Create Event"}
        </div>
      </CustomDialogTitle>

      <CustomDialogContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Event Details */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6" id="event-form">
          {/* Event Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Organization Select */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Organization *
              </label>
              <SearchableSelect
                options={organizations.map((org: any) => ({
                  value: org._id,
                  label: org.orgn_user?.name || "Unnamed Org",
                }))}
                value={formData.organization_id}
                onChange={(value) =>
                  setFormData({ ...formData, organization_id: value })
                }
                placeholder="Select organization"
                disabled={!organizations.length}
                search={true}
              />
            </div>
          )}

          {/* Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.startAt}
                onChange={(e) =>
                  setFormData({ ...formData, startAt: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                End Date & Time *
              </label>
              <Input
                type="datetime-local"
                value={formData.endAt}
                onChange={(e) =>
                  setFormData({ ...formData, endAt: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Deadline *
            </label>
            <Input
              type="datetime-local"
              value={formData.registration_deadline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  registration_deadline: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Venue Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Venue Type *
            </label>
            <SearchableSelect
              options={venueTypes}
              value={formData.venue.type}
              onChange={(value) => updateVenue("type", value)}
              placeholder="Select venue type"
              
            />
          </div>

          {/* Physical Venue Fields */}
          {(formData.venue.type === "physical" ||
            formData.venue.type === "hybrid") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <Input
                    value={formData.venue.address}
                    onChange={(e) => updateVenue("address", e.target.value)}
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    value={formData.venue.city}
                    onChange={(e) => updateVenue("city", e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    State
                  </label>
                  <Input
                    value={formData.venue.state}
                    onChange={(e) => updateVenue("state", e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Postal Code
                  </label>
                  <Input
                    value={formData.venue.postal_code}
                    onChange={(e) => updateVenue("postal_code", e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <Input
                    value={formData.venue.country}
                    onChange={(e) => updateVenue("country", e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </>
          )}

          {/* Virtual Venue Fields */}
          {(formData.venue.type === "virtual" ||
            formData.venue.type === "hybrid") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Virtual Link
                </label>
                <Input
                  type="url"
                  value={formData.venue.virtual_link}
                  onChange={(e) => updateVenue("virtual_link", e.target.value)}
                  placeholder="https://zoom.us/j/1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Platform
                </label>
                <SearchableSelect
                  options={platforms}
                  value={formData.venue.platform}
                  onChange={(value) => updateVenue("platform", value)}
                  placeholder="Select platform"
                  
                />
              </div>
            </div>
          )}

          {/* Event Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Event Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <StatusSwitch
                  value={formData.status === "published"}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value ? "published" : "draft",
                    })
                  }
                  activeLabel="Published"
                  inactiveLabel="Draft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Attendees *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.max_attendees}
                  onChange={(e) =>
                    setFormData({ ...formData, max_attendees: e.target.value })
                  }
                  placeholder="100"
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    color: darkMode ? "#ffffff" : "#000000",
                    borderColor: darkMode ? "#4b5563" : "#d1d5db",
                  }}
                  required
                />
              </div>
            </div>
            {/* Event Type Switches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Paid Event */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type
                </label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md h-10">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.isPaidEvent ? "Paid Event" : "Free Event"}
                  </span>
                  <Switch
                    checked={formData.isPaidEvent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPaidEvent: checked })
                    }
                  />
                </div>
              </div>

              {/* Public Event */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Visibility
                </label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-md h-10">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.is_public ? "Public Event" : "Private Event"}
                  </span>
                  <Switch
                    checked={formData.is_public}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_public: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Show only if Paid Event is true */}
            {formData.isPaidEvent && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-blue-200 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Payment Settings
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ticket Price (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.ticketPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ticketPrice: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        className="pl-8"
                        required
                        style={{
                          backgroundColor: darkMode ? "#374151" : "#ffffff",
                          color: darkMode ? "#ffffff" : "#000000",
                          borderColor: darkMode ? "#4b5563" : "#d1d5db",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <QuillEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                placeholder="Enter plan description"
                rows={4}
              />
            </div>
          </div>
            </form>
          </div>

          {/* Right Column - Company Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base font-medium">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2 text-[#0077ED]" />
                    Participating Companies ({selectedCompanies.length})
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outlined"
                    onClick={() => setShowAddCompany(!showAddCompany)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Company
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Company Form */}
                {showAddCompany && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/30">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add Company to Event</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Select Company *</label>
                        <SearchableSelect
                          options={companies
                            .filter(c => !selectedCompanies.some(sc => sc.company_id === c._id))
                            .map((company: any) => ({
                              value: company._id,
                              label: company.orgn_user?.name || "Unknown Company",
                            }))}
                          value={selectedCompanyId}
                          onChange={setSelectedCompanyId}
                          placeholder="Select a company"
                          search={true}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Booth Number</label>
                          <Input
                            value={companyDetails.booth_number}
                            onChange={(e) => setCompanyDetails({...companyDetails, booth_number: e.target.value})}
                            placeholder="B-20"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Booth Size</label>
                          <SearchableSelect
                            options={[
                              { value: "3x3", label: "3x3" },
                              { value: "4x4", label: "4x4" },
                              { value: "5x5", label: "5x5" },
                              { value: "6x6", label: "6x6" },
                            ]}
                            value={companyDetails.booth_size}
                            onChange={(value) => setCompanyDetails({...companyDetails, booth_size: value})}
                            placeholder="Select size"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Booth Location</label>
                          <Input
                            value={companyDetails.booth_location}
                            onChange={(e) => setCompanyDetails({...companyDetails, booth_location: e.target.value})}
                            placeholder="Innovation Zone"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Participation Fee ($)</label>
                          <Input
                            type="number"
                            min="0"
                            value={companyDetails.participation_fee}
                            onChange={(e) => setCompanyDetails({...companyDetails, participation_fee: e.target.value})}
                            placeholder="2000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Facilities</label>
                        <Input
                          placeholder="Type facility and press Enter (e.g., Power, Internet)"
                          onKeyDown={handleFacilityKeyDown}
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {companyDetails.facilities.map((facility, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="flex items-center gap-1 px-2 py-1 text-xs"
                            >
                              {facility}
                              <X
                                className="w-3 h-3 cursor-pointer text-red-500"
                                onClick={() => removeFacility(facility)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Special Requirements</label>
                        <Input
                          value={companyDetails.special_requirements}
                          onChange={(e) => setCompanyDetails({...companyDetails, special_requirements: e.target.value})}
                          placeholder="Any special requirements..."
                        />
                      </div>

                      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-600 p-2 rounded">
                        <span className="text-sm">Auto Approve</span>
                        <Switch
                          checked={companyDetails.auto_approve}
                          onCheckedChange={(checked) => setCompanyDetails({...companyDetails, auto_approve: checked})}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="contained"
                          color="primary"
                          onClick={handleAddCompany}
                          disabled={!selectedCompanyId}
                        >
                          Add Company
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outlined"
                          onClick={() => setShowAddCompany(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Companies List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedCompanies.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No companies added yet</p>
                      <p className="text-sm">Click "Add Company" to get started</p>
                    </div>
                  ) : (
                    selectedCompanies.map((company) => (
                      <div
                        key={company._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {company.company_name}
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                              <div>Booth: {company.booth.number}</div>
                              <div>Size: {company.booth.size}</div>
                              <div>Location: {company.booth.location}</div>
                              <div>Fee: ${company.participation_fee.toLocaleString()}</div>
                            </div>

                            {company.booth.facilities && company.booth.facilities.length > 0 && (
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                  {company.booth.facilities.map((facility: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1 py-0.5"
                                    >
                                      {facility}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="text"
                            onClick={() => handleRemoveCompany(company.company_id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          variant="outlined"
          onClick={() => onOpenChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          form="event-form"
          type="submit"
          disabled={loading || !formData.title || !formData.description}
          variant="contained"
          color="primary"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              {isEdit ? "Saving..." : "Creating..."}
            </div>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? "Save Changes" : "Create Event"}
            </>
          )}
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default EventsAddEditDialog;

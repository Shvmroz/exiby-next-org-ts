import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Ruler,
  Hash,
  DollarSign,
  Building,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { useSnackbar } from "notistack";
import Button from "@/components/ui/custom-button";
import SearchableSelect from "@/components/ui/searchable-select";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { mockCompanies } from "@/mockData/companies";
import { mockParticipatingCompanies } from "@/mockData/participatingCompanies";

interface ParticipatingCompaniesDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle?: string;
}

interface ParticipatingCompany {
  _id: string;
  company_id: string;
  company_name: string;
  booth: {
    number: string;
    size: string;
    location: string;
    facilities: string[];
  };
  participation_fee: number;
  auto_approve: boolean;
  special_requirements: string;
  status: "approved" | "pending" | "rejected";
}

const ParticipatingCompaniesDialog: React.FC<
  ParticipatingCompaniesDialogProps
> = ({ open, onClose, eventId, eventTitle = "Event" }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [participatingCompanies, setParticipatingCompanies] = useState<
    ParticipatingCompany[]
  >(mockParticipatingCompanies as ParticipatingCompany[]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] =
    useState<ParticipatingCompany | null>(null);
  const [loading, setLoading] = useState(false);

  // Add participant form state
  const [newParticipant, setNewParticipant] = useState({
    company_id: "",
    booth_number: "",
    booth_size: "",
    booth_location: "",
    facilities: [] as string[],
    participation_fee: 0,
    auto_approve: false,
    special_requirements: "",
    status: "approved" as "approved" | "pending" | "rejected",
  });
  const [boothDetails, setBoothDetails] = useState({
    number: "",
    size: "",
    location: "",
    facilities: [] as string[],
    participation_fee: 0,
    special_requirements: "",
    auto_approve: false,
  });

  // Convert companies to selectable options
  const companyOptions = mockCompanies.map((company) => ({
    value: company._id,
    label: company.orgn_user?.name || company._id,
  }));

  const getCompanyStatusBadge = (status: string) => {
    const statusConfig = {
      approved: {
        label: "Approved",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      pending: {
        label: "Pending",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      rejected: {
        label: "Rejected",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleAddCompany = () => {
    if (!selectedCompany) {
      enqueueSnackbar("Please select a company", { variant: "warning" });
      return;
    }

    const newCompany: ParticipatingCompany = {
      _id: `comp_${Date.now()}`,
      company_id: selectedCompany,
      company_name:
        companyOptions.find((c) => c.value === selectedCompany)?.label || "",
      booth: {
        number: boothDetails.number,
        size: boothDetails.size,
        location: boothDetails.location,
        facilities: boothDetails.facilities,
      },
      participation_fee: boothDetails.participation_fee,
      auto_approve: boothDetails.auto_approve,
      special_requirements: boothDetails.special_requirements,
      status: boothDetails.auto_approve ? "approved" : "pending",
    };

    setParticipatingCompanies((prev) => [...prev, newCompany]);
    setShowAddDialog(false);
    setSelectedCompany(null);
    setBoothDetails({
      number: "",
      size: "",
      location: "",
      facilities: [],
      participation_fee: 0,
      special_requirements: "",
      auto_approve: false,
    });
    enqueueSnackbar("Company added successfully", { variant: "success" });
  };

  const handleRemoveCompany = (company: ParticipatingCompany) => {
    setCompanyToDelete(company);
    setDeleteDialog(true);
  };

  const handleAddParticipant = () => {
    setShowAddDialog(true);
  };

  const handleCancelAdd = () => {
    setShowAddDialog(false);
    setNewParticipant({
      company_id: "",
      booth_number: "",
      booth_size: "",
      booth_location: "",
      facilities: [],
      participation_fee: 0,
      auto_approve: false,
      special_requirements: "",
      status: "approved",
    });
  };

  const handleSubmitParticipant = async () => {
    if (!newParticipant.company_id || !newParticipant.booth_number) {
      enqueueSnackbar("Please fill in required fields", { variant: "error" });
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setShowAddDialog(false);

    // Reset form
    setNewParticipant({
      company_id: "",
      booth_number: "",
      booth_size: "",
      booth_location: "",
      facilities: [],
      participation_fee: 0,
      auto_approve: false,
      special_requirements: "",
      status: "approved",
    });

    enqueueSnackbar("Participant added successfully", { variant: "success" });
  };

  const handleInputChange = (field: string, value: any) => {
    setNewParticipant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      setParticipatingCompanies((prev) =>
        prev.filter((c) => c._id !== companyToDelete._id)
      );
      enqueueSnackbar(`${companyToDelete.company_name} removed from event`, {
        variant: "success",
      });
    }
    setDeleteDialog(false);
    setCompanyToDelete(null);
  };

  const filteredCompanies = participatingCompanies.filter((company) =>
    company.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <CustomDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{ height: "600px" }}
      >
        <CustomDialogTitle onClose={onClose}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {showAddDialog
                  ? "Add New Participant"
                  : "Participating Companies"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {eventTitle}
              </p>
            </div>
          </div>
        </CustomDialogTitle>

        <CustomDialogContent dividers className="space-y-6">
          {showAddDialog ? (
            // ✅ Add Participant Form
            <div className="space-y-4">
              {/* Company Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Company Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SearchableSelect
                    options={mockCompanies.map((company) => ({
                      value: company._id,
                      label: company.orgn_user.name,
                    }))}
                    value={newParticipant.company_id}
                    onChange={(value) => handleInputChange("company_id", value)}
                    placeholder="Select a company"
                  />
                </CardContent>
              </Card>

              {/* Booth Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Booth Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Booth Number"
                    value={newParticipant.booth_number}
                    onChange={(e) =>
                      handleInputChange("booth_number", e.target.value)
                    }
                  />
                  <SearchableSelect
                    options={[
                      { value: "3x3", label: "3x3" },
                      { value: "4x4", label: "4x4" },
                      { value: "5x5", label: "5x5" },
                    ]}
                    value={newParticipant.booth_size}
                    onChange={(value) => handleInputChange("booth_size", value)}
                    placeholder="Booth Size"
                  />
                  <Input
                    className="md:col-span-2"
                    placeholder="Booth Location"
                    value={newParticipant.booth_location}
                    onChange={(e) =>
                      handleInputChange("booth_location", e.target.value)
                    }
                  />
                </CardContent>
              </Card>

              {/* Participation Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Participation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Participation Fee ($)"
                    value={newParticipant.participation_fee}
                    onChange={(e) =>
                      handleInputChange(
                        "participation_fee",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <SearchableSelect
                    options={[
                      { value: "approved", label: "Approved" },
                      { value: "pending", label: "Pending" },
                      { value: "rejected", label: "Rejected" },
                    ]}
                    value={newParticipant.status}
                    onChange={(value) => handleInputChange("status", value)}
                    placeholder="Select Status"
                  />
                  <Input
                    placeholder="Special Requirements"
                    value={newParticipant.special_requirements}
                    onChange={(e) =>
                      handleInputChange("special_requirements", e.target.value)
                    }
                  />
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={newParticipant.auto_approve}
                      onChange={(e) =>
                        handleInputChange("auto_approve", e.target.checked)
                      }
                    />
                    Auto-approve this participant
                  </label>
                </CardContent>
              </Card>
            </div>
          ) : (
            // ✅ Companies List
            <>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddParticipant}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Participant
                </Button>
              </div>

              <div className="space-y-2">
                {filteredCompanies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No companies found</p>
                  </div>
                ) : (
                  filteredCompanies.map((company) => (
                    <Card
                      key={company._id}
                      className="bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium">
                              {company.company_name}
                            </h4>

                            <p className="text-xs mt-1 flex items-center gap-1">
                              <Hash className="w-3 h-3 text-gray-400" />
                              Booth: {company.booth.number} (
                              {company.booth.size})
                            </p>

                            <p className="text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              Location: {company.booth.location}
                            </p>
                            <p className="text-xs flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-gray-400" />
                              Fee: ${company.participation_fee}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            {getCompanyStatusBadge(company.status)}
                            <Button
                              size="sm"
                              variant="text"
                              onClick={() => handleRemoveCompany(company)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </CustomDialogContent>

        <CustomDialogActions>
          {showAddDialog ? (
            <>
              <Button variant="outlined" onClick={handleCancelAdd}>
                Back to List
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitParticipant}
                disabled={
                  loading ||
                  !newParticipant.company_id ||
                  !newParticipant.booth_number
                }
              >
                {loading ? "Adding..." : "Add Participant"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={onClose}>
                Close
              </Button>
            </>
          )}
        </CustomDialogActions>
      </CustomDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog}
        onOpenChange={(open) => {
          setDeleteDialog(open);
          if (!open) setCompanyToDelete(null);
        }}
        title="Remove Company"
        content={`Are you sure you want to remove "${companyToDelete?.company_name}" from this event? This action cannot be undone.`}
        confirmButtonText="Remove"
        onConfirm={handleConfirmDelete}
        loading={false}
      />
    </>
  );
};

export default ParticipatingCompaniesDialog;

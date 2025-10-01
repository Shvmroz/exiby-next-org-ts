import React, { useState, useEffect } from "react";
import { Building, Plus, Trash2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const ParticipatingCompaniesDialog: React.FC<ParticipatingCompaniesDialogProps> = ({
  open,
  onClose,
  eventId,
  eventTitle = "Event",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [participatingCompanies, setParticipatingCompanies] = useState<ParticipatingCompany[]>(mockParticipatingCompanies as ParticipatingCompany[]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<ParticipatingCompany | null>(null);
  const [boothDetails, setBoothDetails] = useState({
    number: "",
    size: "",
    location: "",
    facilities: [] as string[],
    participation_fee: 0,
    special_requirements: "",
    auto_approve: false
  });

  // Convert companies to selectable options
  const companyOptions = mockCompanies.map(company => ({
    value: company._id,
    label: company.orgn_user?.name || company._id
  }));

  const getCompanyStatusBadge = (status: string) => {
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

  const handleAddCompany = () => {
    if (!selectedCompany) {
      enqueueSnackbar("Please select a company", { variant: "warning" });
      return;
    }

    const newCompany: ParticipatingCompany = {
      _id: `comp_${Date.now()}`,
      company_id: selectedCompany,
      company_name: companyOptions.find(c => c.value === selectedCompany)?.label || "",
      booth: {
        number: boothDetails.number,
        size: boothDetails.size,
        location: boothDetails.location,
        facilities: boothDetails.facilities
      },
      participation_fee: boothDetails.participation_fee,
      auto_approve: boothDetails.auto_approve,
      special_requirements: boothDetails.special_requirements,
      status: boothDetails.auto_approve ? "approved" : "pending"
    };

    setParticipatingCompanies(prev => [...prev, newCompany]);
    setShowAddDialog(false);
    setSelectedCompany(null);
    setBoothDetails({
      number: "",
      size: "",
      location: "",
      facilities: [],
      participation_fee: 0,
      special_requirements: "",
      auto_approve: false
    });
    enqueueSnackbar("Company added successfully", { variant: "success" });
  };

  const handleRemoveCompany = (company: ParticipatingCompany) => {
    setCompanyToDelete(company);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      setParticipatingCompanies(prev => 
        prev.filter(c => c._id !== companyToDelete._id)
      );
      enqueueSnackbar(`${companyToDelete.company_name} removed from event`, { variant: "success" });
    }
    setDeleteDialog(false);
    setCompanyToDelete(null);
  };

  const filteredCompanies = participatingCompanies.filter(company =>
    company.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <CustomDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{ height: '600px' }}
      >
        <CustomDialogTitle onClose={onClose}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Participating Companies
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {eventTitle}
                </p>
              </div>
            </div>
          </div>
        </CustomDialogTitle>

        <CustomDialogContent dividers className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="contained"
              color="primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>

          {/* Companies List */}
          <div className="space-y-2">
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No companies found</p>
              </div>
            ) : (
              filteredCompanies.map((company) => (
                <Card key={company._id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {company.company_name}
                          </h4>
                          <Button
                            size="sm"
                            variant="text"
                            onClick={() => handleRemoveCompany(company)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2 flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="mb-2">
                          {getCompanyStatusBadge(company.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Booth:</span> 
                            <span className="truncate">{company.booth.number}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Size:</span> 
                            <span>{company.booth.size}</span>
                          </div>
                          <div className="flex items-center col-span-2">
                            <span className="font-medium mr-1">Location:</span> 
                            <span className="truncate">{company.booth.location}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Fee:</span> 
                            <span>${company.participation_fee.toLocaleString()}</span>
                          </div>
                        </div>

                        {company.booth.facilities && company.booth.facilities.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Facilities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {company.booth.facilities.slice(0, 4).map((facility: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-1.5 py-0.5"
                                >
                                  {facility}
                                </Badge>
                              ))}
                              {company.booth.facilities.length > 4 && (
                                <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs px-1.5 py-0.5">
                                  +{company.booth.facilities.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {company.special_requirements && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Requirements:</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {company.special_requirements}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CustomDialogContent>

        <CustomDialogActions>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </CustomDialogActions>
      </CustomDialog>

      {/* Add Company Dialog */}
      <CustomDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <CustomDialogTitle onClose={() => setShowAddDialog(false)}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Company to Event
              </h1>
            </div>
          </div>
        </CustomDialogTitle>

        <CustomDialogContent dividers className="space-y-4">
          <div className="space-y-4">
            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Company *
              </label>
              <SearchableSelect
                options={companyOptions}
                value={selectedCompany}
                onChange={(value) => setSelectedCompany(value)}
                placeholder="Choose a company"
                search={true}
              />
            </div>

            {/* Booth Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booth Number *
                </label>
                <Input
                  value={boothDetails.number}
                  onChange={(e) => setBoothDetails(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="e.g., A-15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booth Size *
                </label>
                <Input
                  value={boothDetails.size}
                  onChange={(e) => setBoothDetails(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="e.g., 3x3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <Input
                value={boothDetails.location}
                onChange={(e) => setBoothDetails(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Main Hall"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Participation Fee *
              </label>
              <Input
                type="number"
                value={boothDetails.participation_fee}
                onChange={(e) => setBoothDetails(prev => ({ ...prev, participation_fee: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Requirements
              </label>
              <Input
                value={boothDetails.special_requirements}
                onChange={(e) => setBoothDetails(prev => ({ ...prev, special_requirements: e.target.value }))}
                placeholder="Any special requirements..."
              />
            </div>
          </div>
        </CustomDialogContent>

        <CustomDialogActions>
          <Button 
            onClick={() => setShowAddDialog(false)} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCompany}
            variant="contained"
            color="primary"
            disabled={!selectedCompany || !boothDetails.number || !boothDetails.size || !boothDetails.location}
          >
            Add Company
          </Button>
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

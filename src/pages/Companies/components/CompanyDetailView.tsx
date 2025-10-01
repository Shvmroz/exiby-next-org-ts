import React, { useEffect, useState } from "react";
import {
  Building,
  Calendar,
  DollarSign,
  Users,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  
  Briefcase,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { useAppContext } from "@/contexts/AppContext";
import { useSnackbar } from "notistack";
import Spinner from "../../../components/ui/spinner";
import { _company_detail_view_api } from "@/DAL/companyAPI";
import Button from "@/components/ui/custom-button";

interface CompanyDetailViewProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
}

const CompanyDetailView = ({
  open,
  onClose,
  companyId,
}: CompanyDetailViewProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { darkMode } = useAppContext();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const getCompanyDetail = async (id: string) => {
    setLoading(true);
    const result = await _company_detail_view_api(id);
    if (result?.code === 200) {
      setCompany(result?.data.company);
    } else {
      enqueueSnackbar(result?.message || "Failed to fetch company", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && companyId) {
      getCompanyDetail(companyId);
    }
  }, [open, companyId]);

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        Inactive
      </Badge>
    );
  };

  if (!company) return null;

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle onClose={onClose}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{company.orgn_user?.name}</h1>
        </div>
      </CustomDialogTitle>

      <CustomDialogContent dividers>
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner />
          </div>
        )}
        {!loading && (
          <Card>
          <CardContent>
            {/* --- Totals Section --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {company.total_events ?? "N/A"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Events
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {company.total_payments !== undefined
                    ? `$${company.total_payments.toLocaleString()}`
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Payments</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Users className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {company.bio?.company_size ?? "N/A"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Company Size
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {company.bio?.founded_year ?? "N/A"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Founded</div>
              </div>
            </div>
        
            {/* --- Company Info --- */}
            <div className="flex items-center justify-between text-gray-800 dark:text-gray-200">
              <p className="text-sm">
                <span className="font-semibold">Industry:</span>{" "}
                {company.bio?.industry || (
                  <span className="text-gray-500 dark:text-gray-400">
                    No industry available
                  </span>
                )}
              </p>
              {getStatusBadge(company.status)}
            </div>
        
            <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Location:</span>{" "}
              {company.bio?.location || "N/A"}
            </p>
        
            <div className="mt-3 mb-2 text-sm text-gray-800 dark:text-gray-200">
              <span className="font-semibold">Description:</span>{" "}
              {company.bio?.description &&
              company.bio.description.replace(/<[^>]+>/g, "").trim() ? (
                company.bio.description.replace(/<[^>]+>/g, "").trim()
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  No description available
                </span>
              )}
            </div>
        
            {/* --- Services --- */}
            {company.bio?.services?.length > 0 && (
              <div className="mt-4">
                <h2 className="text-sm font-semibold flex items-center mb-2 text-gray-800 dark:text-gray-200">
                  <Briefcase className="w-4 h-4 mr-2" /> Services
                </h2>
                <div className="flex flex-wrap gap-2">
                  {company.bio.services.map((service: string, idx: number) => (
                    <Badge
                      key={idx}
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        
            {/* --- Contact Info --- */}
            <div className="space-y-2 mt-6">
              <h2 className="text-sm font-semibold flex items-center text-gray-800 dark:text-gray-200">
                Contact Information
              </h2>
              <p className="text-sm flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4" />
                <span>{company.contact?.email || "No email available"}</span>
              </p>
              <p className="text-sm flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <Phone className="w-4 h-4" />
                <span>{company.contact?.phone || "No phone available"}</span>
              </p>
              <p className="text-sm flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>{company.contact?.address || "No address available"}</span>
              </p>
            </div>
        
            {/* --- Social Links --- */}
            <div className="space-y-2 mt-6">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Social Links
              </h2>
              {company.social_links?.website && (
                <p className="text-sm flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <a
                    href={company.social_links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {company.social_links.website}
                  </a>
                </p>
              )}
              {company.social_links?.linkedin && (
                <p className="text-sm flex items-center space-x-2">
                  <Linkedin className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                  <a
                    href={company.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    {company.social_links.linkedin}
                  </a>
                </p>
              )}
              {company.social_links?.twitter && (
                <p className="text-sm flex items-center space-x-2">
                  <Twitter className="w-4 h-4 text-sky-500" />
                  <a
                    href={company.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 hover:underline"
                  >
                    {company.social_links.twitter}
                  </a>
                </p>
              )}
              {company.social_links?.facebook && (
                <p className="text-sm flex items-center space-x-2">
                  <Facebook className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <a
                    href={company.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {company.social_links.facebook}
                  </a>
                </p>
              )}
            </div>
        
            {/* --- Metadata --- */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 text-right">
                <p>
                  <span className="font-semibold">QR Code ID:</span>{" "}
                  {company.qr_code_id || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Created At:</span>{" "}
                  {company.createdAt
                    ? new Date(company.createdAt).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Updated At:</span>{" "}
                  {company.updatedAt
                    ? new Date(company.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        )}
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Close
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default CompanyDetailView;

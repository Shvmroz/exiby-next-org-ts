import React, { useState } from "react";
import { Receipt, Download, Calendar, Filter, ChevronLeft, ChevronRight, FileText, CircleCheck as CheckCircle, Clock, Circle as XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/custom-button";
import SearchableSelect from "@/components/ui/searchable-select";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  date: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  description: string;
  downloadUrl?: string;
}

const BillingHistoryScreen: React.FC = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Static invoice data
  const invoices: Invoice[] = [
    {
      id: "inv_001",
      invoiceNumber: "INV-2024-001",
      amount: 49.99,
      currency: "USD",
      date: "2024-11-25",
      status: "paid",
      description: "Professional Plan - Monthly",
      downloadUrl: "#"
    },
    {
      id: "inv_002",
      invoiceNumber: "INV-2024-002",
      amount: 49.99,
      currency: "USD",
      date: "2024-10-25",
      status: "paid",
      description: "Professional Plan - Monthly",
      downloadUrl: "#"
    },
    {
      id: "inv_003",
      invoiceNumber: "INV-2024-003",
      amount: 49.99,
      currency: "USD",
      date: "2024-09-25",
      status: "paid",
      description: "Professional Plan - Monthly",
      downloadUrl: "#"
    },
    {
      id: "inv_004",
      invoiceNumber: "INV-2024-004",
      amount: 19.99,
      currency: "USD",
      date: "2024-08-25",
      status: "refunded",
      description: "Basic Plan - Monthly (Refunded)",
      downloadUrl: "#"
    },
    {
      id: "inv_005",
      invoiceNumber: "INV-2024-005",
      amount: 49.99,
      currency: "USD",
      date: "2024-12-25",
      status: "pending",
      description: "Professional Plan - Monthly",
      downloadUrl: "#"
    },
    {
      id: "inv_006",
      invoiceNumber: "INV-2024-006",
      amount: 99.99,
      currency: "USD",
      date: "2024-07-25",
      status: "failed",
      description: "Enterprise Plan - Monthly",
      downloadUrl: "#"
    }
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            <Receipt className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Filter invoices based on status
  const filteredInvoices = invoices.filter(invoice => {
    if (statusFilter !== "all" && invoice.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = (invoice: Invoice) => {
    console.log(`Downloading invoice: ${invoice.invoiceNumber}`);
    // Simulate download
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Billing History
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and download your invoices and payment history
          </p>
        </div>
        <Button
          variant="outlined"
          onClick={() => console.log('Export all invoices')}
        >
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Filter Invoices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="Select end date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <SearchableSelect
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => console.log('Apply filters')}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-green-600" />
            <span>Invoices ({filteredInvoices.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Invoice Number
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {invoice.description}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => handleDownload(invoice)}
                          disabled={invoice.status === 'failed'}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Summary */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
                  'USD'
                )}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Total Paid</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(
                  invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
                  'USD'
                )}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {invoices.length}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200">Total Invoices</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingHistoryScreen;
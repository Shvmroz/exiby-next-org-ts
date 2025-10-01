'use client';

import React, { useState } from "react";
import { Receipt, Download, Calendar, Filter, FileText, CircleCheck as CheckCircle, Clock, Circle as XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/custom-button";
import SearchableSelect from "@/components/ui/searchable-select";
import CustomTable, { TableHeader } from "@/components/ui/custom-table";

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  // Table configuration
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
      key: "invoice",
      label: "Invoice Number",
      renderData: (invoice) => (
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {invoice.invoiceNumber}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      renderData: (invoice) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {invoice.description}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      renderData: (invoice) => (
        <span className="font-semibold text-gray-900 dark:text-white text-sm">
          {formatCurrency(invoice.amount, invoice.currency)}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      renderData: (invoice) => (
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          {formatDate(invoice.date)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      renderData: (invoice) => getStatusBadge(invoice.status),
    },
    {
      key: "actions",
      label: "Actions",
      renderData: (invoice) => (
        <Button
          variant="text"
          size="sm"
          onClick={() => handleDownload(invoice)}
          disabled={invoice.status === 'failed'}
        >
          <Download className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  // Pagination handlers
  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1);
  };

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

  // Update total count when filtering
  React.useEffect(() => {
    setTotalCount(filteredInvoices.length);
    setTotalPages(Math.ceil(filteredInvoices.length / rowsPerPage));
  }, [filteredInvoices.length, rowsPerPage]);

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + rowsPerPage);

  const handleDownload = (invoice: Invoice) => {
    console.log(`Downloading invoice: ${invoice.invoiceNumber}`);
    // Simulate download
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Billing History
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View and download your invoices and payment history
          </p>
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => console.log('Export all invoices')}
        >
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

     

      {/* Invoices Table */}
      <CustomTable
        data={paginatedInvoices}
        TABLE_HEAD={TABLE_HEAD}
        MENU_OPTIONS={[]}
        custom_pagination={{
          total_count: totalCount,
          rows_per_page: rowsPerPage,
          page: currentPage,
          handleChangePage,
          onRowsPerPageChange,
        }}
        totalPages={totalPages}
        loading={false}
        emptyMessage="No invoices found"
      />
    </div>
  );
};

export default BillingHistoryScreen;
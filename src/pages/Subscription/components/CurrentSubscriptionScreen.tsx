'use client';

import React, { useState } from "react";
import { CreditCard, Calendar, DollarSign, CircleCheck as CheckCircle, CircleArrowUp as ArrowUpCircle, Clock, Shield, Circle as XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/custom-button";
import { useRouter } from "next/navigation";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";

const CurrentSubscriptionScreen: React.FC = () => {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Static subscription data
  const subscriptionData = {
    planName: "Professional Plan",
    billingCycle: "Monthly",
    price: 49.99,
    currency: "USD",
    status: "Active",
    nextBillingDate: "2024-12-25",
    subscriptionId: "sub_1234567890",
    features: [
      "Unlimited Events",
      "Up to 500 Companies",
      "Advanced Analytics",
      "Priority Support",
      "Custom Branding"
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Pending
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

  const handleUpgradePlan = () => {
    router.push('/subscription/plans');
  };

  const handleCancelSubscription = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelSubscription = () => {
    // Simulate cancellation
    console.log('Subscription cancelled');
    setShowCancelDialog(false);
    // You can add actual cancellation logic here
  };

  return (
    <div className="space-y-4">
      {/* Current Plan Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Current Plan</span>
            </CardTitle>
            {getStatusBadge(subscriptionData.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {subscriptionData.planName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subscriptionData.billingCycle} Billing
              </p>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-blue-600">
                  ${subscriptionData.price}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  /{subscriptionData.billingCycle.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Billing Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    Next Billing Date
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(subscriptionData.nextBillingDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    Subscription ID
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {subscriptionData.subscriptionId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="contained"
              color="primary"
              size="sm"
              onClick={handleUpgradePlan}
              className="text-xs px-3 py-1"
            >
              <ArrowUpCircle className="w-3 h-3 mr-1" />
              Upgrade Plan
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="sm"
              onClick={handleCancelSubscription}
              className="text-xs px-3 py-1"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Plan Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subscriptionData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span>Usage Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-blue-600">45</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active Events</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Unlimited available</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-blue-600">180</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Registered Companies</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">320 remaining</div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-xl font-bold text-blue-600">2,450</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Attendees</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">This month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <ConfirmDeleteDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Subscription"
        content="Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period. This action cannot be undone."
        confirmButtonText="Cancel Subscription"
        onConfirm={confirmCancelSubscription}
        loading={false}
      />
    </div>
  );
};

export default CurrentSubscriptionScreen;
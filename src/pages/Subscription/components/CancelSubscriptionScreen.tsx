import React, { useState } from "react";
import { 
  XCircle, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Shield,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/custom-button";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";

const CancelSubscriptionScreen: React.FC = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Static subscription data
  const subscriptionData = {
    planName: "Professional Plan",
    nextBillingDate: "2024-12-25",
    remainingDays: 18,
    currentPeriodEnd: "2024-12-25"
  };

  const handleCancelClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmDialog(false);
    
    // Simulate cancellation process
    if (Math.random() > 0.2) { // 80% success rate for demo
      setShowSuccess(true);
      setShowError(false);
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cancel Subscription
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We're sorry to see you go. Please review the cancellation details below.
        </p>
      </div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Subscription cancelled successfully!
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                {cancelAtPeriodEnd 
                  ? `Your subscription will remain active until ${formatDate(subscriptionData.currentPeriodEnd)}.`
                  : "Your subscription has been cancelled immediately."
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">
                Failed to cancel subscription
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                There was an error processing your cancellation. Please try again or contact support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Current Subscription Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscriptionData.planName}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Plan</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatDate(subscriptionData.nextBillingDate)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Next Billing Date</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscriptionData.remainingDays} days
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Remaining in Period</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Cancellation Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Checkbox
              id="cancel-at-period-end"
              checked={cancelAtPeriodEnd}
              onCheckedChange={(checked) => setCancelAtPeriodEnd(checked as boolean)}
            />
            <div className="flex-1">
              <label 
                htmlFor="cancel-at-period-end" 
                className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
              >
                Cancel at period end
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Keep your subscription active until {formatDate(subscriptionData.currentPeriodEnd)}, 
                then cancel automatically. You won't be charged for the next billing cycle.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  What happens when you cancel?
                </h4>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>• You'll lose access to premium features</li>
                  <li>• Your events and data will be preserved for 30 days</li>
                  <li>• You can reactivate your subscription anytime</li>
                  <li>• No refunds for partial billing periods</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Button */}
      <div className="flex justify-center">
        <Button
          variant="contained"
          color="error"
          size="lg"
          onClick={handleCancelClick}
          className="px-8 py-3"
        >
          <XCircle className="w-5 h-5 mr-2" />
          Cancel Subscription
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <CustomDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <CustomDialogTitle onClose={() => setShowConfirmDialog(false)}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Cancellation
              </h3>
            </div>
          </div>
        </CustomDialogTitle>

        <CustomDialogContent>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Cancellation Details:
                </span>
              </div>
              <ul className="text-sm text-gray-600 dark:text-gray-400 ml-6 space-y-1">
                <li>
                  {cancelAtPeriodEnd 
                    ? `• Subscription will end on ${formatDate(subscriptionData.currentPeriodEnd)}`
                    : "• Subscription will be cancelled immediately"
                  }
                </li>
                <li>• You'll retain access to your data for 30 days</li>
                <li>• You can reactivate anytime before data deletion</li>
              </ul>
            </div>
          </div>
        </CustomDialogContent>

        <CustomDialogActions>
          <Button
            variant="outlined"
            onClick={() => setShowConfirmDialog(false)}
          >
            Keep Subscription
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Yes, Cancel Subscription
          </Button>
        </CustomDialogActions>
      </CustomDialog>
    </div>
  );
};

export default CancelSubscriptionScreen;
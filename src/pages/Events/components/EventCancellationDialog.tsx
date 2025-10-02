import React, { useState } from "react";
import { AlertTriangle, Save, X, MessageSquare, Users, DollarSign, Bell } from "lucide-react";
import {
  CustomDialog,
  CustomDialogTitle,
  CustomDialogContent,
  CustomDialogActions,
} from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SearchableSelect from "@/components/ui/searchable-select";
import { Switch } from "@/components/ui/switch";
import Button from "@/components/ui/custom-button";

interface EventCancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: (data: CancellationData) => void;
  loading?: boolean;
  event?: any | null;
}

interface CancellationData {
  reason: string;
  cancellation_note: string;
  notify_attendees: boolean;
  process_refunds: boolean;
  refund_percentage: number;
}

const cancellationReasons = [
  { value: "venue_unavailable", label: "Venue Unavailable" },
  { value: "speaker_cancelled", label: "Speaker Cancelled" },
  { value: "low_attendance", label: "Low Attendance" },
  { value: "weather_conditions", label: "Weather Conditions" },
  { value: "technical_issues", label: "Technical Issues" },
  { value: "health_safety", label: "Health & Safety Concerns" },
  { value: "force_majeure", label: "Force Majeure" },
  { value: "budget_constraints", label: "Budget Constraints" },
  { value: "other", label: "Other" },
];

const EventCancellationDialog: React.FC<EventCancellationDialogProps> = ({
  open,
  onOpenChange,
  onCancel,
  loading = false,
  event,
}) => {
  const [formData, setFormData] = useState<CancellationData>({
    reason: "",
    cancellation_note: "",
    notify_attendees: true,
    process_refunds: true,
    refund_percentage: 100,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCancel(formData);
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
      // Reset form when closing
      setFormData({
        reason: "",
        cancellation_note: "",
        notify_attendees: true,
        process_refunds: true,
        refund_percentage: 100,
      });
    }
  };

  const isFormValid = formData.reason && formData.cancellation_note.trim();

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <CustomDialogTitle onClose={handleClose}>
        <div className="flex items-center">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cancel Event
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {event?.title || "Event"}
            </p>
          </div>
        </div>
      </CustomDialogTitle>

      <CustomDialogContent>
        <form onSubmit={handleSubmit} className="space-y-6" id="cancellation-form">
          {/* Warning Notice */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  Important Notice
                </h4>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Cancelling this event will permanently change its status and cannot be undone. 
                  All attendees will be notified if you choose to do so.
                </p>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cancellation Reason *
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <div className="pl-10">
                <SearchableSelect
                  options={cancellationReasons}
                  value={formData.reason}
                  onChange={(value) =>
                    setFormData({ ...formData, reason: value })
                  }
                  placeholder="Select cancellation reason"
                  search={true}
                />
              </div>
            </div>
          </div>

          {/* Cancellation Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cancellation Note *
            </label>
            <Textarea
              value={formData.cancellation_note}
              onChange={(e) =>
                setFormData({ ...formData, cancellation_note: e.target.value })
              }
              placeholder="Provide detailed explanation for the cancellation..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This message will be included in attendee notifications if enabled.
            </p>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
              <Bell className="w-4 h-4 mr-2 text-blue-500" />
              Notification Settings
            </h3>

            {/* Notify Attendees Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Notify Attendees
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Send cancellation notification to all registered attendees
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.notify_attendees}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, notify_attendees: checked })
                }
              />
            </div>

            {/* Process Refunds Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Process Refunds
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Automatically process refunds for paid attendees
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.process_refunds}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, process_refunds: checked })
                }
              />
            </div>

            {/* Refund Percentage */}
            {formData.process_refunds && (
              <div className="ml-8 space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Refund Percentage
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.refund_percentage}
                    onChange={(e) => {
                      const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                      setFormData({ ...formData, refund_percentage: value });
                    }}
                    placeholder="100"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Percentage of ticket price to refund (0-100%)
                </p>
              </div>
            )}
          </div>

          {/* Impact Summary */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
              Cancellation Impact
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
              <li>• Event status will be changed to "Cancelled"</li>
              <li>• {formData.notify_attendees ? "All attendees will receive cancellation notification" : "Attendees will NOT be notified"}</li>
              <li>• {formData.process_refunds ? `${formData.refund_percentage}% refunds will be processed automatically` : "No refunds will be processed"}</li>
              <li>• Event will remain visible in your dashboard for record keeping</li>
            </ul>
          </div>
        </form>
      </CustomDialogContent>

      <CustomDialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          form="cancellation-form"
          type="submit"
          variant="contained"
          color="error"
          disabled={loading || !isFormValid}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-2 border-t-white mr-2"></div>
              Cancelling Event...
            </div>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Cancel Event
            </>
          )}
        </Button>
      </CustomDialogActions>
    </CustomDialog>
  );
};

export default EventCancellationDialog;
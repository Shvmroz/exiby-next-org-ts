'use client';

import React, { useState } from "react";
import { CreditCard, Calendar, DollarSign, CircleCheck as CheckCircle, CircleAlert as AlertCircle, CircleArrowUp as ArrowUpCircle, Circle as XCircle, Receipt, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CurrentSubscriptionScreen from "./components/CurrentSubscriptionScreen";
import UpgradeSubscriptionScreen from "./components/UpgradeSubscriptionScreen";
import CancelSubscriptionScreen from "./components/CancelSubscriptionScreen";
import BillingHistoryScreen from "./components/BillingHistoryScreen";
import UpdateCardScreen from "./components/UpdateCardScreen";

const SubscriptionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subscription Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your subscription, billing, and payment methods
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>

      {/* Subscription Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="current" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Current Plan</span>
          </TabsTrigger>
          <TabsTrigger value="upgrade" className="flex items-center space-x-2">
            <ArrowUpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Upgrade</span>
          </TabsTrigger>
          <TabsTrigger value="cancel" className="flex items-center space-x-2">
            <XCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Cancel</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <CurrentSubscriptionScreen />
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-6">
          <UpgradeSubscriptionScreen />
        </TabsContent>

        <TabsContent value="cancel" className="space-y-6">
          <CancelSubscriptionScreen />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingHistoryScreen />
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <UpdateCardScreen />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionPage;
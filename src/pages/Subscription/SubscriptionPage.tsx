'use client';

import React, { useState } from "react";
import { CreditCard, Receipt, CircleCheck as CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CurrentSubscriptionScreen from "./components/CurrentSubscriptionScreen";
import BillingHistoryScreen from "./components/BillingHistoryScreen";

const SubscriptionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Subscription
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription and billing history
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>

      {/* Subscription Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current" className="flex items-center space-x-2 text-sm">
            <CreditCard className="w-4 h-4" />
            <span>Current Subscription</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2 text-sm">
            <Receipt className="w-4 h-4" />
            <span>Billing History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <CurrentSubscriptionScreen />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <BillingHistoryScreen />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionPage;
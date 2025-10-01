'use client';

import React, { useState } from "react";
import { ArrowLeft, Zap, Crown, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/custom-button";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  current?: boolean;
}

const SubscriptionPlansPage: React.FC = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 19.99,
      billingCycle: "monthly",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 5 Events per month",
        "Up to 100 Companies",
        "Basic Analytics",
        "Email Support",
        "Standard Templates"
      ],
      icon: <Zap className="w-5 h-5" />,
      color: "blue"
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: 49.99,
      billingCycle: "monthly",
      description: "Ideal for growing businesses",
      features: [
        "Unlimited Events",
        "Up to 500 Companies",
        "Advanced Analytics",
        "Priority Support",
        "Custom Branding",
        "API Access"
      ],
      popular: true,
      current: true,
      icon: <Crown className="w-5 h-5" />,
      color: "purple"
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 99.99,
      billingCycle: "monthly",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Professional",
        "Unlimited Companies",
        "Advanced Security",
        "24/7 Phone Support",
        "Custom Integrations",
        "Dedicated Account Manager",
        "SLA Guarantee"
      ],
      icon: <Building2 className="w-5 h-5" />,
      color: "green"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700"
        };
      case "purple":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-200 dark:border-purple-800",
          text: "text-purple-600",
          button: "bg-purple-600 hover:bg-purple-700"
        };
      case "green":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          text: "text-green-600",
          button: "bg-green-600 hover:bg-green-700"
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-200 dark:border-gray-800",
          text: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700"
        };
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    router.push(`/subscription/payment?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="text"
            onClick={() => router.push('/subscription')}
            className="mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subscription
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Your Plan
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select the perfect plan for your business needs
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const colorClasses = getColorClasses(plan.color);
            const isSelected = selectedPlan === plan.id;
            
            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-200 cursor-pointer ${
                  plan.popular 
                    ? `${colorClasses.bg} ${colorClasses.border} ring-2 ring-purple-500` 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                } ${
                  isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white text-xs px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-600 text-white text-xs px-3 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-3">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${colorClasses.bg} flex items-center justify-center ${colorClasses.text}`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                  
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        /{plan.billingCycle}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="contained"
                    className={`w-full text-sm ${
                      plan.current 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : plan.popular 
                        ? colorClasses.button 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={plan.current}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!plan.current) {
                        handleSelectPlan(plan.id);
                      }
                    }}
                  >
                    {plan.current ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Can I change my plan anytime?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  All plans come with a 14-day free trial. No credit card required to start.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;

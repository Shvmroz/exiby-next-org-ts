import React, { useState } from "react";
import { 
  CheckCircle, 
  ArrowUpCircle,
  Star,
  Zap,
  Shield,
  Crown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/custom-button";

const UpgradeSubscriptionScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Static plan data
  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 19.99,
      billingCycle: "monthly",
      popular: false,
      icon: Shield,
      features: [
        "Up to 10 Events",
        "Up to 50 Companies",
        "Basic Analytics",
        "Email Support",
        "Standard Templates"
      ],
      limitations: [
        "Limited customization",
        "Basic reporting"
      ]
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: 49.99,
      billingCycle: "monthly",
      popular: true,
      icon: Star,
      features: [
        "Unlimited Events",
        "Up to 500 Companies",
        "Advanced Analytics",
        "Priority Support",
        "Custom Branding",
        "API Access"
      ],
      limitations: []
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 99.99,
      billingCycle: "monthly",
      popular: false,
      icon: Crown,
      features: [
        "Unlimited Everything",
        "White-label Solution",
        "Advanced Integrations",
        "24/7 Phone Support",
        "Custom Development",
        "Dedicated Account Manager",
        "SLA Guarantee"
      ],
      limitations: []
    }
  ];

  const handleUpgrade = () => {
    if (!selectedPlan) {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Simulate upgrade process
    setShowSuccess(true);
    setShowError(false);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upgrade Your Subscription
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a plan that fits your organization's needs
        </p>
      </div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 dark:text-green-200 font-medium">
              Subscription upgraded successfully! Your new plan will be active immediately.
            </p>
          </div>
        </div>
      )}

      {showError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-600" />
            <p className="text-red-800 dark:text-red-200 font-medium">
              Please select a plan before upgrading.
            </p>
          </div>
        </div>
      )}

      {/* Plan Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                  : 'hover:border-blue-300'
              } ${plan.popular ? 'border-blue-400' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 rounded-full ${
                    plan.popular 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      plan.popular ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{plan.billingCycle}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                <div className="pt-4">
                  <div className={`w-full h-10 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected ? (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Click to select
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Payment Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Plan ID
              </label>
              <Input
                value="plan_1234567890abcdef"
                disabled
                className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Auto-generated payment plan identifier
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Subscription ID
              </label>
              <Input
                value="sub_0987654321fedcba"
                disabled
                className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your current subscription identifier
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Button */}
      <div className="flex justify-center">
        <Button
          variant="contained"
          color="primary"
          size="lg"
          onClick={handleUpgrade}
          disabled={!selectedPlan}
          className="px-8 py-3"
        >
          <ArrowUpCircle className="w-5 h-5 mr-2" />
          Upgrade Subscription
        </Button>
      </div>

      {/* Additional Information */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Instant Upgrade
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your subscription will be upgraded immediately. You'll be charged the prorated amount 
                for the remaining billing period, and your next bill will reflect the new plan pricing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpgradeSubscriptionScreen;
'use client';

import React, { useState, useEffect } from "react";
import { ArrowLeft, Lock, CreditCard, Calendar, User, Mail, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/custom-button";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 19.99,
      billingCycle: "monthly",
      features: ["Up to 5 Events", "Up to 100 Companies", "Basic Analytics", "Email Support"]
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: 49.99,
      billingCycle: "monthly",
      features: ["Unlimited Events", "Up to 500 Companies", "Advanced Analytics", "Priority Support"]
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 99.99,
      billingCycle: "monthly",
      features: ["Everything in Professional", "Unlimited Companies", "24/7 Support", "Custom Integrations"]
    }
  ];

  useEffect(() => {
    if (searchParams) {
      const planId = searchParams.get('plan');
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      } else {
        router.push('/subscription/plans');
      }
    }
  }, [searchParams, router]);

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange('cardNumber', formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    handleInputChange('expiryDate', formatted);
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    enqueueSnackbar('Payment successful! Your subscription has been updated.', { variant: 'success' });
    
    setLoading(false);
    router.push('/subscription');
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="text"
            onClick={() => router.push('/subscription/plans')}
            className="mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Payment
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Secure payment powered by industry-leading encryption
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Plan Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Selected Plan</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    {selectedPlan.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      ${selectedPlan.price}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      per {selectedPlan.billingCycle}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Billed monthly
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Cancel anytime
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="text-sm"
                    />
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVV
                    </label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      maxLength={4}
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={paymentData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <Input
                    type="text"
                    placeholder="123 Main Street"
                    value={paymentData.billingAddress}
                    onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <Input
                      type="text"
                      placeholder="New York"
                      value={paymentData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State
                    </label>
                    <Input
                      type="text"
                      placeholder="NY"
                      value={paymentData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ZIP Code
                    </label>
                    <Input
                      type="text"
                      placeholder="10001"
                      value={paymentData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Country
                    </label>
                    <Input
                      type="text"
                      value={paymentData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Plan</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedPlan.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Billing Cycle</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Monthly
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${selectedPlan.price}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${(selectedPlan.price * 0.08).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${(selectedPlan.price * 1.08).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-800 dark:text-green-300 font-medium">
                        Secure Payment
                      </span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>

                  {/* Complete Payment Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePayment}
                    className="w-full text-sm"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Complete Payment"}
                  </Button>

                  {/* Plan Features */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-3">
                      What's included:
                    </h4>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

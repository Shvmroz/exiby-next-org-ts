import React, { useState } from "react";
import { CreditCard, Shield, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Lock, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/custom-button";
import SearchableSelect from "@/components/ui/searchable-select";

const UpdateCardScreen: React.FC = () => {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: ""
  });

  const [validationErrors, setValidationErrors] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Static current card data
  const currentCard = {
    last4: "4242",
    brand: "Visa",
    expiryMonth: "12",
    expiryYear: "2025",
    cardholderName: "John Doe"
  };

  // Month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  // Year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  const validateCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!cleaned) return "Card number is required";
    if (cleaned.length < 13 || cleaned.length > 19) return "Invalid card number";
    if (!/^\d+$/.test(cleaned)) return "Card number must contain only digits";
    return "";
  };

  const validateCVV = (cvv: string) => {
    if (!cvv) return "CVV is required";
    if (cvv.length < 3 || cvv.length > 4) return "CVV must be 3 or 4 digits";
    if (!/^\d+$/.test(cvv)) return "CVV must contain only digits";
    return "";
  };

  const validateCardholderName = (name: string) => {
    if (!name.trim()) return "Cardholder name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateExpiry = (month: string, year: string) => {
    if (!month) return "Expiry month is required";
    if (!year) return "Expiry year is required";
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
    
    if (expiryDate < currentDate) return "Card has expired";
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 23) return; // Max length with spaces
    }

    // Limit CVV to 4 digits
    if (field === 'cvv' && value.length > 4) return;

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      cardNumber: validateCardNumber(cardData.cardNumber),
      expiryMonth: "",
      expiryYear: "",
      cvv: validateCVV(cardData.cvv),
      cardholderName: validateCardholderName(cardData.cardholderName)
    };

    const expiryError = validateExpiry(cardData.expiryMonth, cardData.expiryYear);
    if (expiryError) {
      errors.expiryMonth = expiryError;
      errors.expiryYear = expiryError;
    }

    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  const handleUpdateCard = () => {
    if (!validateForm()) {
      return;
    }

    // Simulate API call
    if (Math.random() > 0.2) { // 80% success rate for demo
      setShowSuccess(true);
      setShowError(false);
      setTimeout(() => setShowSuccess(false), 5000);
      
      // Reset form
      setCardData({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardholderName: ""
      });
    } else {
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Update Payment Method
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Update your credit card information for subscription billing
        </p>
      </div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Payment method updated successfully!
              </p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                Your new card will be used for future billing cycles.
              </p>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">
                Failed to update payment method
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                There was an error processing your card. Please check your information and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Current Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {currentCard.brand} ending in {currentCard.last4}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Expires {currentCard.expiryMonth}/{currentCard.expiryYear} • {currentCard.cardholderName}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Card Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-green-600" />
            <span>New Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Card Number *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={cardData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className={`pl-10 ${validationErrors.cardNumber ? 'border-red-500' : ''}`}
                maxLength={23}
              />
            </div>
            {validationErrors.cardNumber && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {validationErrors.cardNumber}
              </p>
            )}
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry Month *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <div className="pl-10">
                  <SearchableSelect
                    options={monthOptions}
                    value={cardData.expiryMonth}
                    onChange={(value) => handleInputChange('expiryMonth', value)}
                    placeholder="MM"
                    className={validationErrors.expiryMonth ? 'border-red-500' : ''}
                  />
                </div>
              </div>
              {validationErrors.expiryMonth && (
                <p className="text-red-600 text-xs mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {validationErrors.expiryMonth}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry Year *
              </label>
              <SearchableSelect
                options={yearOptions}
                value={cardData.expiryYear}
                onChange={(value) => handleInputChange('expiryYear', value)}
                placeholder="YYYY"
                className={validationErrors.expiryYear ? 'border-red-500' : ''}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CVV *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  className={`pl-10 ${validationErrors.cvv ? 'border-red-500' : ''}`}
                  maxLength={4}
                />
              </div>
              {validationErrors.cvv && (
                <p className="text-red-600 text-xs mt-1 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {validationErrors.cvv}
                </p>
              )}
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cardholder Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={cardData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                placeholder="John Doe"
                className={`pl-10 ${validationErrors.cardholderName ? 'border-red-500' : ''}`}
              />
            </div>
            {validationErrors.cardholderName && (
              <p className="text-red-600 text-xs mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {validationErrors.cardholderName}
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Secure Payment Processing
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your payment information is encrypted and processed securely. We never store your 
                  complete card details on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="contained"
              color="primary"
              size="lg"
              onClick={handleUpdateCard}
              className="px-8 py-3"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Update Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateCardScreen;
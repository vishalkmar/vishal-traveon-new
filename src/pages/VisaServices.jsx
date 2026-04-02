import React from 'react';
import { CheckCircle, Clock, FileText, Globe2, HelpCircle, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex items-start p-6 bg-white rounded-lg shadow-lg">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
        <Icon className="text-teal-600" size={24} />
      </div>
    </div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const ProcessStep = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const VisaServices = () => {
  const features = [
    {
      icon: Globe2,
      title: "Global Coverage",
      description: "Visa assistance for over 100 countries worldwide"
    },
    {
      icon: CheckCircle,
      title: "Expert Guidance",
      description: "Professional support throughout the visa application process"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick turnaround times for visa applications"
    },
    {
      icon: FileText,
      title: "Document Assistance",
      description: "Help with document preparation and verification"
    },
    {
      icon: Users,
      title: "Group Visas",
      description: "Specialized handling for group and corporate visas"
    },
    {
      icon: HelpCircle,
      title: "24/7 Support",
      description: "Round-the-clock assistance for visa-related queries"
    }
  ];

  const process = [
    {
      number: 1,
      title: "Initial Consultation",
      description: "Free consultation to understand your visa requirements"
    },
    {
      number: 2,
      title: "Document Collection",
      description: "Guidance on required documents and assistance in collection"
    },
    {
      number: 3,
      title: "Application Review",
      description: "Thorough review of your visa application and documents"
    },
    {
      number: 4,
      title: "Submission",
      description: "Submission of application to relevant authorities"
    },
    {
      number: 5,
      title: "Tracking",
      description: "Regular updates on your visa application status"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-teal-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Visa Services</h1>
          <p className="text-xl text-teal-100">Professional visa assistance for hassle-free travel</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Visa Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <ProcessStep key={index} {...step} />
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">What types of visas do you handle?</h3>
            <p className="text-gray-600">We handle all types of visas including tourist, business, work, student, and residence visas for countries worldwide.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">How long does the visa process take?</h3>
            <p className="text-gray-600">Processing times vary by country and visa type. We'll provide you with an estimated timeline during your consultation.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">What documents are required?</h3>
            <p className="text-gray-600">Required documents vary by visa type and destination. We'll provide a comprehensive checklist during the initial consultation.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply for Your Visa?</h2>
          <p className="text-xl mb-8">Contact us today to start your visa application process</p>
          <a
            href="/contact"
            className="bg-white text-teal-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors inline-block"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default VisaServices;

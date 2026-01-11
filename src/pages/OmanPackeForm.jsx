import { useState, useEffect } from 'react';
import { Upload, User, Phone, Mail, FileText, Image, CreditCard } from 'lucide-react';

const OmanTourPackageDetailsForm = () => {
  const [packageType, setPackageType] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [persons, setPersons] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');


  const packageOptions = [
    { value: '', label: 'Select Package Type' },
    { value: 'tour_package', label: 'Oman Tour Package', price: 5000 },
    { value: 'visa_10_days', label: 'Oman Visa (10 Days)', price: 2000 },
    { value: 'visa_30_days', label: 'Oman Visa (30 Days)', price: 6000 }
  ];

  const getPackagePrice = () => {
    const selected = packageOptions.find(opt => opt.value === packageType);
    return selected?.price || 0;
  };

  const calculateGrandTotal = () => {
    const price = getPackagePrice();
    const count = parseInt(numberOfPersons) || 0;
    return price * count;
  };

  useEffect(() => {
    const count = parseInt(numberOfPersons) || 0;
    if (count > 0 && count !== persons.length) {
      const newPersons = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        passportScan: null,
        panCard: null,
        flightBooking: null,
        photo: null
      }));
      setPersons(newPersons);
      setErrors({});
    } else if (count === 0) {
      setPersons([]);
    }
  }, [numberOfPersons]);

  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^\d+$/.test(phone)) return 'Phone number must contain only numbers';
    if (phone.length !== 10) return 'Phone number must be exactly 10 digits';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name must contain only alphabets';
    return '';
  };

  const validateFile = (file, type, maxSize = 5) => {
    if (!file) return '';

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size must not exceed ${maxSize}MB`;
    }

    if (type === 'pdf' && file.type !== 'application/pdf') {
      return 'Only PDF files are allowed';
    }

    if (type === 'image' && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      return 'Only JPG, JPEG, or PNG files are allowed';
    }

    return '';
  };

  const handlePackageChange = (e) => {
    setPackageType(e.target.value);
    setNumberOfPersons('');
    setPersons([]);
    setErrors({});
  };

  const handleNumberOfPersonsChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 50)) {
      setNumberOfPersons(value);
      setErrors({ ...errors, numberOfPersons: '' });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    const error = validatePhoneNumber(value);
    setErrors({ ...errors, phoneNumber: error });
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = value;
    setPersons(updatedPersons);

    const errorKey = `person_${index}_${field}`;
    let error = '';

    if (field === 'name') {
      error = validateName(value);
    } else if (field === 'email') {
      error = validateEmail(value);
    }

    setErrors({ ...errors, [errorKey]: error });
  };

  const handleFileChange = (index, field, file) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = file;
    setPersons(updatedPersons);

    const errorKey = `person_${index}_${field}`;
    let error = '';

    if (field === 'passportScan' || field === 'panCard' || field === 'flightBooking') {
      error = validateFile(file, 'pdf');
    } else if (field === 'photo') {
      error = validateFile(file, 'image');
    }

    setErrors({ ...errors, [errorKey]: error });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!packageType) {
      newErrors.packageType = 'Please select a package type';
    }

    if (!numberOfPersons || parseInt(numberOfPersons) < 1) {
      newErrors.numberOfPersons = 'Number of persons must be at least 1';
    }

    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      newErrors.phoneNumber = phoneError;
    }

    persons.forEach((person, index) => {
      const nameError = validateName(person.name);
      if (nameError) newErrors[`person_${index}_name`] = nameError;

      const emailError = validateEmail(person.email);
      if (emailError) newErrors[`person_${index}_email`] = emailError;

      if (!person.passportScan) {
        newErrors[`person_${index}_passportScan`] = 'Passport scan is required';
      } else {
        const fileError = validateFile(person.passportScan, 'pdf');
        if (fileError) newErrors[`person_${index}_passportScan`] = fileError;
      }

      if (!person.photo) {
        newErrors[`person_${index}_photo`] = 'Passport size photo is required';
      } else {
        const fileError = validateFile(person.photo, 'image');
        if (fileError) newErrors[`person_${index}_photo`] = fileError;
      }

      if (packageType === 'tour_package') {
        if (person.panCard) {
          const fileError = validateFile(person.panCard, 'pdf');
          if (fileError) newErrors[`person_${index}_panCard`] = fileError;
        }
        if (person.flightBooking) {
          const fileError = validateFile(person.flightBooking, 'pdf');
          if (fileError) newErrors[`person_${index}_flightBooking`] = fileError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('packageType', packageType);
      formData.append('phoneNumber', phoneNumber);
      formData.append('numberOfPersons', numberOfPersons);
      formData.append('grandTotal', calculateGrandTotal());

      persons.forEach((person, index) => {
        // formData.append(`persons[${index}][name]`, person.name);
        // formData.append(`persons[${index}][email]`, person.email);

        if (person.passportScan) {
          formData.append(`persons[${index}][passportScan]`, person.passportScan);
        }
        if (person.photo) {
          formData.append(`persons[${index}][photo]`, person.photo);
        }
        if (packageType === 'tour_package') {
          if (person.panCard) {
            formData.append(`persons[${index}][panCard]`, person.panCard);
          }
          if (person.flightBooking) {
            formData.append(`persons[${index}][flightBooking]`, person.flightBooking);
          }
        }
      });

      console.log('Form data prepared for API submission');

      alert('Form validated successfully! Proceeding to payment...');

      proceedToPayment();

    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const proceedToPayment = () => {
    const amount = calculateGrandTotal();
    console.log('Initiating Cashfree payment for amount:', amount);
    alert(`Payment gateway integration: Amount ₹${amount.toLocaleString('en-IN')}`);
  };

  const isFormValid = () => {
    return (
      packageType &&
      numberOfPersons &&
      parseInt(numberOfPersons) >= 1 &&
      phoneNumber &&
      validatePhoneNumber(phoneNumber) === '' &&
      persons.length > 0 &&
      persons.every(person =>
        // person.name &&
        // validateName(person.name) === '' &&
        // person.email &&
        // validateEmail(person.email) === '' &&
        person.passportScan &&
        person.photo
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 px-6 sm:px-8 py-[50px] mt-[-50]">
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Oman Tour & Visa Package Form
            </h1>
            <p className="text-emerald-50 text-center mt-2 text-sm sm:text-base">
              Complete the form below to book your package
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Package Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={packageType}
                  onChange={handlePackageChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
                >
                  {packageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                     
                    </option>
                  ))}
                </select>
                {errors.packageType && (
                  <p className="mt-1 text-sm text-red-600">{errors.packageType}</p>
                )}
              </div>

              {packageType && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Number of Persons <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={numberOfPersons}
                        onChange={handleNumberOfPersonsChange}
                        min="1"
                        max="50"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="Enter number"
                      />
                      {errors.numberOfPersons && (
                        <p className="mt-1 text-sm text-red-600">{errors.numberOfPersons}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        maxLength="10"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        placeholder="10 digit number"
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                  <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    <Mail className="inline w-4 h-4 mr-1" />
    Email Address <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      setErrors({ ...errors, email: validateEmail(e.target.value) });
    }}
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
    placeholder="email@example.com"
  />
  {errors.email && (
    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
  )}
</div>


                  {persons.length > 0 && (
                    <div className="space-y-6 mt-8">
                      <h2 className="text-xl font-bold text-gray-800 border-b-2 border-emerald-500 pb-2">
                        Person Details
                      </h2>

                      {persons.map((person, index) => (
                        <div
                          key={person.id}
                          className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-emerald-600" />
                            Person {index + 1}
                          </h3>

                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FileText className="inline w-4 h-4 mr-1" />
                                Passport Scan (Front & Back) <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept=".pdf"
                                  onChange={(e) => handleFileChange(index, 'passportScan', e.target.files[0])}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
                                />
                                <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                              </div>
                              <p className="mt-1 text-xs text-gray-500">PDF only, max 5MB</p>
                              {errors[`person_${index}_passportScan`] && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors[`person_${index}_passportScan`]}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Image className="inline w-4 h-4 mr-1" />
                                Passport Size Photo <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png"
                                  onChange={(e) => handleFileChange(index, 'photo', e.target.files[0])}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
                                />
                                <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                              </div>
                              <p className="mt-1 text-xs text-gray-500">JPG, JPEG, PNG only</p>
                              {errors[`person_${index}_photo`] && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors[`person_${index}_photo`]}
                                </p>
                              )}
                            </div>
                          </div>

                          {packageType === 'tour_package' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  <CreditCard className="inline w-4 h-4 mr-1" />
                                 PAN Card <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(index, 'panCard', e.target.files[0])}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
                                  />
                                  <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">PDF only, max 5MB</p>
                                {errors[`person_${index}_panCard`] && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors[`person_${index}_panCard`]}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  <FileText className="inline w-4 h-4 mr-1" />
                                  Flight Booking Details (Optional)
                                </label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(index, 'flightBooking', e.target.files[0])}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer"
                                  />
                                  <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">PDF only, max 5MB</p>
                                {errors[`person_${index}_flightBooking`] && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors[`person_${index}_flightBooking`]}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {persons.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 mt-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            {packageOptions.find(opt => opt.value === packageType)?.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {numberOfPersons} {parseInt(numberOfPersons) === 1 ? 'Person' : 'Persons'} × ₹{getPackagePrice().toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Grand Total</p>
                          <p className="text-3xl sm:text-4xl font-bold text-emerald-600">
                            ₹{calculateGrandTotal().toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {persons.length > 0 && (
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isFormValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Secure payment powered by Cashfree</p>
        </div>
      </div>
    </div>
  );
};

export default OmanTourPackageDetailsForm;
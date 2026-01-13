import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SelectionCard from "./SelectionCard";
import TourForm from "./forms/TourForm";
import VisaForm from "./forms/VisaForm";

const OmanPage = () => {
  // 'selection', 'tour_package', 'visa_10', 'visa_30'
  const [view, setView] = useState("selection");

  const handleBack = () => {
    setView("selection");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Experience Oman
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Begin your journey with our premium tour packages and hassle-free
            visa processing.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {view === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <SelectionCard
                title="Oman Tour Package"
                price="₹35,000"
                advance="₹5,000"
                description="Complete tour experience including desert safari, wadi visits, and city tours."
                onSelect={() => setView("tour_package")}
                delay={0.1}
                features={[
                  "5 Days / 4 Nights",
                  "Hotel & Transport",
                  "Guided Tours",
                  "Breakfast Included",
                ]}
                color="emerald"
              />
              <SelectionCard
                title="10 Days Visa"
                price="₹2,000"
                description="Perfect for short business trips or quick getaways to explore the Sultanate."
                onSelect={() => setView("visa_10")}
                delay={0.2}
                features={[
                  "Single Entry",
                  "Valid for 10 Days",
                  "Express Processing",
                  "24/7 Support",
                ]}
                color="blue"
              />
              <SelectionCard
                title="30 Days Visa"
                price="₹6,000"
                description="Extended stay visa for thorough exploration and long vacations."
                onSelect={() => setView("visa_30")}
                delay={0.3}
                features={[
                  "Single Entry",
                  "Valid for 30 Days",
                  "Express Processing",
                  "24/7 Support",
                ]}
                color="indigo"
              />
            </motion.div>
          )}

          {view === "tour_package" && (
            <motion.div
              key="tour_form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <TourForm onBack={handleBack} />
            </motion.div>
          )}

          {(view === "visa_10" || view === "visa_30") && (
            <motion.div
              key="visa_form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <VisaForm
                type={view === "visa_10" ? "10_DAYS" : "30_DAYS"}
                title={
                  view === "visa_10"
                    ? "10 Days Visa Application"
                    : "30 Days Visa Application"
                }
                price={view === "visa_10" ? 2000 : 6000}
                onBack={handleBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OmanPage;

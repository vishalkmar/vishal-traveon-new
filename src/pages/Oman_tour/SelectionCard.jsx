import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const SelectionCard = ({
  title,
  price,
  description,
  onSelect,
  delay,
  features,
  color = "emerald",
}) => {
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      btn: "bg-emerald-600 hover:bg-emerald-700",
      icon: "text-emerald-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      btn: "bg-blue-600 hover:bg-blue-700",
      icon: "text-blue-500",
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-700",
      btn: "bg-indigo-600 hover:bg-indigo-700",
      icon: "text-indigo-500",
    },
  };

  const theme = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-white rounded-2xl p-8 shadow-lg border ${theme.border} hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${theme.bg} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110`}
      />

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className={`text-3xl font-extrabold ${theme.text}`}>
            {price}
          </span>
          <span className="text-sm text-slate-500">/person</span>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        <div className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center text-sm text-slate-700">
              <Check className={`w-4 h-4 mr-3 ${theme.icon}`} />
              {feature}
            </div>
          ))}
        </div>

        <button
          onClick={onSelect}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white ${theme.btn} shadow-md hover:shadow-lg transition-all flex items-center justify-center group-hover:gap-2`}
        >
          Select Package
          <ArrowRight className="w-4 h-4 transition-all opacity-0 group-hover:opacity-100" />
        </button>
      </div>
    </motion.div>
  );
};

export default SelectionCard;

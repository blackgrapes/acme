import { motion, AnimatePresence } from "framer-motion";
import { Clock, UserCheck, Siren, FileCheck2, PlayCircle } from "lucide-react";

export default function WhyChooseUsSection({ setIsVideoOpen }) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 mt-4 md:mt-5">
      <div className="container mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-8 md:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900">
            Why Choose <span className="text-primary">Our Company</span>?
          </h2>
          <p className="mt-3 text-gray-600 text-base md:text-lg text-center">
            Backed by experience, trusted by clients, and driven by a
            commitment to excellence in every project.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-10 mb-8 md:mb-10 text-center">
          {[
            { value: "800+", label: "Trained Professionals" },
            { value: "50,000+", label: "Training Hours" },
            { value: "12+", label: "Countries" },
            { value: "90%", label: "Client Retention" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="p-3 md:p-4"
            >
              <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </h4>
              <p className="text-gray-600 mt-1 md:mt-2 text-xs md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-items-center">
          {[
            {
              icon: (
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              ),
              title: "Reliability",
              text: "24/7 operations with real-time incident response.",
            },
            {
              icon: (
                <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              ),
              title: "Trained Personnel",
              text: "Regularly vetted and certified security professionals.",
            },
            {
              icon: (
                <Siren className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              ),
              title: "Quick Response",
              text: "Rapid deployment & emergency escalation protocols.",
            },
            {
              icon: (
                <FileCheck2 className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
              ),
              title: "Compliance",
              text: "Fully compliant with statutory & local regulations.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-xl p-4 md:p-6 lg:p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300  w-full"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
            >
              <div className="bg-primary p-3 md:p-4 lg:p-5 rounded-full mb-3 md:mb-4 lg:mb-5 flex items-center justify-center shadow-md">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg md:text-xl mb-1 md:mb-2 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Video CTA */}
        <motion.div
          className="mt-10 w-full flex items-center gap-4 rounded-3xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition-shadow cursor-pointer justify-center bg-white mx-auto"
          whileHover={{ scale: 1.02 }}
          onClick={() => setIsVideoOpen(true)}
        >
          <PlayCircle className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary" />
          <div className="text-left">
            <div className="font-semibold text-gray-900 text-sm md:text-base">
              Watch how we train our team
            </div>
            <div className="text-gray-500 text-xs md:text-sm">
              30–60 seconds training highlight
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
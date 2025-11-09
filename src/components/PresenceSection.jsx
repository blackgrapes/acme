import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function PresenceSection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center space-y-4 md:space-y-6 mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Our <span className="text-primary">Presence</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            We are proudly operating from the heart of India's financial
            capital —
            <span className="font-semibold text-primary"> Mumbai</span>.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch">
          {/* Left: Image */}
          <div className="relative w-full">
            <img
              src="/mumbai-skyline.jpg"
              alt="Mumbai Skyline"
              className="rounded-xl md:rounded-2xl shadow-2xl object-cover w-full h-[300px] sm:h-[400px] md:h-[500px]"
            />
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/80 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Mumbai
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Our Home Base of Operations
              </p>
            </div>
          </div>

          {/* Right: Stats (Equal Height) */}
          <div className="flex flex-col justify-center">
            <div className="grid grid-rows-3 gap-4 md:gap-6 h-[300px] sm:h-[400px] md:h-[500px]">
              {/* Years */}
              <div className="flex items-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 shadow-md hover:shadow-lg transition w-full">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary w-20 md:w-32 text-center">
                  <CountUp end={10} duration={2.5} />+
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-900">
                    Years in Mumbai
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    A decade of trust, delivering reliable and consistent
                    service across the city.
                  </p>
                </div>
              </div>

              {/* Clients */}
              <div className="flex items-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 shadow-md hover:shadow-lg transition w-full">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary w-20 md:w-32 text-center">
                  <CountUp end={500} duration={3} />+
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-900">
                    Clients Served
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    Trusted by hundreds of businesses and individuals to keep
                    them safe and secure.
                  </p>
                </div>
              </div>

              {/* Support */}
              <div className="flex items-center p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 shadow-md hover:shadow-lg transition w-full">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary w-20 md:w-32 text-center">
                  <CountUp end={24} duration={2} />
                  /7
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-900">
                    Support Available
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm mt-1">
                    Round-the-clock assistance ensuring your peace of mind
                    every single day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
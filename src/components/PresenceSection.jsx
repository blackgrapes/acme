"use client";

import CountUp from "react-countup";

export function PresenceSection() {
  return (
    <section className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        {/* Heading */}
        <div className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Our <span className="text-primary">Presence</span>
          </h2>
          <p className="text-secondary max-w-2xl mx-auto text-base sm:text-lg">
            We are proudly operating from the heart of India’s financial capital
            — <span className="font-semibold text-primary">Mumbai</span>.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
          {/* Left: Image */}
          <div className="relative order-2 md:order-1">
            <img
              src="/mumbai-skyline.jpg"
              alt="Mumbai Skyline"
              className="rounded-2xl shadow-2xl object-cover w-full h-[250px] sm:h-[350px] md:h-[450px]"
              loading="lazy"
            />
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg text-center">
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                Mumbai
              </h3>
              <p className="text-secondary text-xs sm:text-sm">
                Our Home Base of Operations
              </p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex flex-col justify-center order-1 md:order-2">
            <div className="grid grid-rows-3 gap-4 sm:gap-6">
              {/* Years */}
              <div className="flex items-center p-4 sm:p-6 rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 shadow-md hover:shadow-lg transition-all">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary w-24 sm:w-32 text-center">
                  <CountUp end={10} duration={2.5} />+
                </div>
                <div className="ml-4 flex-1 text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground">
                    Years in Mumbai
                  </h4>
                  <p className="text-secondary text-xs sm:text-sm mt-1">
                    A decade of trust, delivering reliable and consistent
                    service across the city.
                  </p>
                </div>
              </div>

              {/* Clients */}
              <div className="flex items-center p-4 sm:p-6 rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 shadow-md hover:shadow-lg transition-all">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary w-24 sm:w-32 text-center">
                  <CountUp end={500} duration={3} />+
                </div>
                <div className="ml-4 flex-1 text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground">
                    Clients Served
                  </h4>
                  <p className="text-secondary text-xs sm:text-sm mt-1">
                    Trusted by hundreds of businesses and individuals to keep
                    them safe and secure.
                  </p>
                </div>
              </div>

              {/* Support */}
              <div className="flex items-center p-4 sm:p-6 rounded-2xl bg-gradient-to-tr from-primary/10 to-primary/5 shadow-md hover:shadow-lg transition-all">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary w-24 sm:w-32 text-center">
                  <CountUp end={24} duration={2} />
                  /7
                </div>
                <div className="ml-4 flex-1 text-left">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground">
                    Support Available
                  </h4>
                  <p className="text-secondary text-xs sm:text-sm mt-1">
                    Round-the-clock assistance ensuring your peace of mind every
                    single day.
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

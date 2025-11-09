import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const ClientsSection = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/frontend/clients");
      const clientsData = await response.json();
      // Only show clients that are marked to show on home
      setClients(clientsData.filter((client) => client.showOnHome));
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center space-y-4 md:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Trusted by{" "}
            <span className="text-primary">Leading Organizations</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            We're proud to partner with top corporates, institutions, and
            enterprises across industries.
          </p>
          <div className="w-16 md:w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Carousel Section - Show skeleton when loading */}
        {loading ? (
          <div className="overflow-hidden mt-8 md:mt-12 lg:mt-16 relative">
            <div className="flex space-x-6 md:space-x-10 w-max">
              {/* Skeleton loading for carousel items */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-32 h-20 md:w-44 md:h-28 bg-gray-200 rounded-xl md:rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : clients.length > 0 ? (
          <div className="overflow-hidden mt-8 md:mt-12 lg:mt-16 relative">
            <motion.div
              className="flex space-x-6 md:space-x-10 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              }}
            >
              {/* Duplicate the array for seamless loop */}
              {[...clients, ...clients].map((client, i) => (
                <div
                  key={`${client.id}-${i}`}
                  className="flex-shrink-0 w-32 h-20 md:w-44 md:h-28 bg-white/80 backdrop-blur-md border border-gray-100 rounded-xl md:rounded-2xl shadow-sm 
                           flex justify-center items-center p-4 md:p-6 hover:shadow-xl hover:scale-105 transition duration-300"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-8 md:h-14 object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="text-center mt-8 md:mt-12 lg:mt-16">
            <p className="text-gray-500">No clients to display</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsSection;
import { motion, AnimatePresence } from "framer-motion";

export default function VideoModal({ isVideoOpen, setIsVideoOpen }) {
  return (
    <AnimatePresence>
      {isVideoOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full max-w-3xl bg-black rounded-xl shadow-lg overflow-hidden">
            <button
              className="absolute top-2 right-2 md:top-3 md:right-3 text-white text-2xl font-bold z-50"
              onClick={() => setIsVideoOpen(false)}
            >
              ×
            </button>
            <iframe
              className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
              src="https://www.youtube.com/embed/VIDEO_ID?autoplay=1"
              title="Training Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
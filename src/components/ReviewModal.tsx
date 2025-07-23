import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ExternalLink } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ReviewModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.23, 1, 0.32, 1],
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto"
            >
              <MessageSquare className="text-white" size={28} />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
              className="text-2xl font-bold text-gray-900 mb-3 text-center"
            >
              サービスのご感想を
              <br />
              お聞かせください
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
              className="text-gray-600 mb-8 text-center leading-relaxed"
            >
              皆様からのご意見・ご感想は、より良いサービスの提供に活用させていただきます。
            </motion.p>

            {/* CTA Button */}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3, ease: "easeOut" }}
              href="https://docs.google.com/forms/d/e/1FAIpQLSc3y0AbU3lYa7E6pH3bv9MDeKwUzlnlavdwtHgIEtrc4cPvBQ/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MessageSquare size={20} />
              レビューを書く
              <ExternalLink size={16} />
            </motion.a>

            {/* Close Link */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3, ease: "easeOut" }}
              onClick={onClose}
              className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium"
            >
              後で回答する
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
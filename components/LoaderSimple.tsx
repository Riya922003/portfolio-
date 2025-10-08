// 'use client';

// import { motion } from "framer-motion";
// import { useState, useEffect } from 'react';

// const SimpleFallingText = ({ text }: { text: string }) => {
//   const words = text.split(' ');

//   return (
//     <div className="relative w-full h-96 flex flex-wrap items-start justify-center pt-16 overflow-hidden">
//       {words.map((word, index) => (
//         <motion.div
//           key={index}
//           className="text-white font-bold text-2xl md:text-4xl mx-2 mb-2"
//           initial={{ y: -50, opacity: 0, rotate: 0 }}
//           animate={{ 
//             y: [0, 300, 350], 
//             opacity: [0, 1, 1, 0],
//             rotate: [0, Math.random() * 360]
//           }}
//           transition={{
//             duration: 3,
//             delay: index * 0.1,
//             ease: "easeInOut"
//           }}
//         >
//           {word}
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// const Loader = () => {
//   const [showFallingText, setShowFallingText] = useState(false);

//   const containerVariants = {
//     initial: { opacity: 1 },
//     exit: { 
//       opacity: 0,
//       scale: 0.95,
//       transition: { 
//         duration: 0.6, 
//         ease: "easeInOut" as const
//       } 
//     }
//   };

//   // Trigger falling text animation after a short delay
//   useEffect(() => {
//     console.log('Loader mounted, setting timer for falling text');
//     const timer = setTimeout(() => {
//       console.log('Showing falling text now');
//       setShowFallingText(true);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black z-50 flex items-center justify-center"
//       variants={containerVariants}
//       initial="initial"
//       exit="exit"
//     >
//       {/* Background gradient effect */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black opacity-50" />
      
//       <div className="relative w-full max-w-4xl mx-auto px-8">
//         {showFallingText ? (
//           <SimpleFallingText text="Driven by curiosity for how things work and passion for making them work better" />
//         ) : (
//           <div className="flex items-center justify-center h-96">
//             <div className="text-white text-2xl animate-pulse">Loading...</div>
//           </div>
//         )}
//       </div>

//       {/* Loading indicator */}
//       <motion.div
//         className="absolute bottom-20 flex space-x-1"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1, duration: 0.5 }}
//       >
//         {[0, 1, 2].map((i) => (
//           <motion.div
//             key={i}
//             className="w-2 h-2 bg-white rounded-full"
//             animate={{
//               scale: [1, 1.5, 1],
//               opacity: [0.3, 1, 0.3],
//             }}
//             transition={{
//               duration: 1.5,
//               repeat: Infinity,
//               delay: i * 0.2,
//             }}
//           />
//         ))}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Loader;
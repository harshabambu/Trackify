import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowRoundForward } from "react-icons/io";
import { motion } from "framer-motion";

const FadeUp = (delay) => ({
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      duration: 0.5,
      delay,
      ease: "easeInOut",
    },
  },
});

const SlideLeft = (delay) => ({
  initial: { opacity: 0, x: 50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay, ease: "easeInOut" },
  },
});

function Home() {
  return (
    <section className="bg-light overflow-hidden relative">
      <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px]">
        <div className="flex flex-col justify-center py-14 md:py-0 relative z-20">
          <div className="text-center md:text-left space-y-10 lg:max-w-[400px]">
            <motion.h1
              variants={FadeUp(0.6)}
              initial="initial"
              animate="animate"
              className="text-3xl lg:text-5xl font-bold !leading-snug"
            >
              Tracify, where you track your{" "}
              <span className="text-secondary">Daily</span> progress
            </motion.h1>
            <motion.div
              variants={FadeUp(0.8)}
              initial="initial"
              animate="animate"
              className="flex justify-center md:justify-start"
            >
              <Link to="/register">
                <button className="hover:bg-secondary hover:text-white bg-primary rounded text-white px-6 py-3 flex items-center gap-2 group">
                  Get Started
                  <IoIosArrowRoundForward className="text-xl group-hover:translate-x-2 group-hover:-rotate-45 duration-300" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <motion.img
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
            src="https://img.freepik.com/free-vector/illustrated-business-woman-with-data-analysis-graph_53876-26703.jpg?semt=ais_hybrid"
            alt="user"
            className="w-[400px] xl:w-[600px] relative z-10 drop-shadow"
          />
        </div>
      </div>

      <div className="container pb-14 pt-16 text-center">
        <motion.h1
          variants={FadeUp(0.2)}
          initial="initial"
          animate="animate"
          className="text-4xl font-bold pb-10"
        >
          Why Choose Tracify?
        </motion.h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-evenly">
          <motion.div
            variants={SlideLeft(0.2)}
            initial="initial"
            whileInView={"animate"}
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <div className="text-4xl mb-4">📈</div>
            <h1 className="text-lg font-semibold text-center px-3">
              Progress Tracking
            </h1>
          </motion.div>
          <motion.div
            variants={SlideLeft(0.3)}
            initial="initial"
            whileInView={"animate"}
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <div className="text-4xl mb-4">⏰</div>
            <h1 className="text-lg font-semibold text-center px-3">
              Time Management
            </h1>
          </motion.div>
          <motion.div
            variants={SlideLeft(0.4)}
            initial="initial"
            whileInView={"animate"}
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <div className="text-4xl mb-4">📅</div>
            <h1 className="text-lg font-semibold text-center px-3">
              Goal Setting
            </h1>
          </motion.div>
          <motion.div
            variants={SlideLeft(0.4)}
            initial="initial"
            whileInView={"animate"}
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <div className="text-4xl mb-4">🤝</div>
            <h1 className="text-lg font-semibold text-center px-3">
              Collaboration
            </h1>
          </motion.div>
          <motion.div
            variants={SlideLeft(0.4)}
            initial="initial"
            whileInView={"animate"}
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <div className="text-4xl mb-4">📊</div>
            <h1 className="text-lg font-semibold text-center px-3">
              Visual Progress
            </h1>
          </motion.div>
          <motion.div
            variants={SlideLeft(0.4)}
            initial="initial"
            whileInView={"animate"}
            viewport={{ once: true }}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl"
          >
            <div className="text-4xl mb-4">🤝</div>
            <h1 className="text-lg font-semibold text-center px-3">
              Collaboration
            </h1>
          </motion.div>
        </div>
      </div>

      <div>
        
      </div>
    </section>
  );
}

export default Home;
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Metadata } from "next";
import Contact from "@/components/Contacts";
import Work from "@/components/Work";
import Intro from "@/components/Intro/intro";
import AnimatedCursor from "react-animated-cursor";

// This won't work in a client component, export it separately
// Metadata for the home page is handled in layout.tsx

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();

      setTimeout(() => {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }, 1000);
    })();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div className={`flex w-screen justify-center items-start`}>
      {!isMobile && (
        <AnimatedCursor
          innerSize={36}
          innerStyle={{
            border: "2px solid #6b6253",
            background: "transparent",
          }}
          outerStyle={{ background: "#6b625320" }}
          outerSize={26}
          color="255, 255, 255"
          outerAlpha={1}
          innerScale={0.05}
          outerScale={2}
        />
      )}
      <AnimatePresence mode="wait">{isLoading && <Intro />}</AnimatePresence>
      <div className="flex flex-col justify-center items-center select-none">
        <div className="h-screen w-full 2xl:text-[126px] xl:text-[118px] lg:text-8xl md:text-[78px] text-6xl max-xs:text-[54px] font-source sm:pt-64 pt-56">
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="w-fit">
              <div className="relative">
                <div
                  className="-top-12 left-2 absolute"
                  style={{
                    clipPath: "inset(0% 0% 0% 0%)",
                  }}
                >
                  <motion.div
                    className="relative text-[38px]"
                    initial={{
                      transform: "translateY(60px)",
                    }}
                    animate={{
                      transform: "translateY(0px)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 25,
                      duration: 0.75,
                      delay: 2,
                    }}
                  >
                    <div className="font-source max-lg:text-3xl max-sm:text-[26px]">
                      Hi, I’m Leonardo Parisi
                    </div>
                  </motion.div>
                </div>
                <div
                  style={{
                    clipPath: "inset(0% 0% -20% 0%)",
                  }}
                >
                  <motion.div
                    className="relative"
                    initial={{
                      transform: "translateY(160px)",
                    }}
                    animate={{
                      transform: "translateY(0px)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 25,
                      duration: 0.75,
                      delay: 2.75,
                    }}
                  >
                    <div className="font-source flex max-sm:flex-col gap-4">
                      Front-end <div className="max-sm:hidden">Developer</div>
                    </div>
                  </motion.div>
                </div>
                <div
                  style={{
                    clipPath: "inset(0% 0% -20% 0%)",
                  }}
                >
                  <motion.div
                    className="relative"
                    initial={{
                      transform: "translateY(160px)",
                    }}
                    animate={{
                      transform: "translateY(0px)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 25,
                      duration: 0.75,
                      delay: 3.25,
                    }}
                  >
                    <div className="w-full hidden justify-end max-sm:flex sm:pl-36 xs:pl-28 xxs:pl-20">
                      Developer
                    </div>
                  </motion.div>
                </div>
              </div>
              <div
                style={{
                  clipPath: "inset(0% 0% -20% 0%)",
                }}
              >
                <motion.div
                  className="relative flex sm:justify-end justify-start items-center gap-3"
                  initial={{
                    transform: "translateY(160px)",
                  }}
                  animate={{
                    transform: "translateY(0px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 25,
                    duration: 0.75,
                    delay: 3.75,
                  }}
                >
                  <div className="flex max-sm:flex-col items-center justify-center gap-4 max-sm:pl-16 xxs:pl-12">
                    <div className="lg:h-2 h-1 md:w-32 w-20 max-sm:hidden bg-dark font-source"></div>
                    Based In <div className="max-sm:hidden">Italy.</div>
                  </div>
                </motion.div>
              </div>
              <div
                style={{
                  clipPath: "inset(0% 0% -20% 0%)",
                }}
              >
                <motion.div
                  className="relative"
                  initial={{
                    transform: "translateY(160px)",
                  }}
                  animate={{
                    transform: "translateY(0px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 25,
                    duration: 0.75,
                    delay: 3,
                  }}
                >
                  <div className="w-full hidden max-sm:flex pl-60 xxs:pl-56">
                    Italy
                  </div>
                </motion.div>
              </div>
              <div
                style={{
                  width: "100%",
                  clipPath: "inset(0% 0% 0% 0%)",
                }}
              >
                <motion.div
                  className="text-3xl w-full flex justify-center mt-28"
                  initial={{
                    transform: "translateY(160px)",
                  }}
                  animate={{
                    transform: "translateY(0px)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 25,
                    duration: 0.75,
                    delay: 4.25,
                  }}
                >
                  <div>Scroll down</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="work"
          className="flex flex-col items-center sm:gap-[15vh] gap-[4vh] md:mt-[40vh] mt-[15vh] md:pt-[30vh] pt-[10vh] sm:mb-[50vh] mb-[15vh] 2xl:w-[65%] xl:w-[75%] w-screen max-xl:px-28 max-md:px-12 max-sm:px-6"
        >
          <Work />
          <Contact />
        </div>
      </div>
    </div>
  );
}

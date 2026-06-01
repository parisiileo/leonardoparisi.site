"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "./menu.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";
import { TfiClose } from "react-icons/tfi";
import data from "@/data/data.json";

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const path = usePathname();
  const home = path === "/";

  const container = useRef<HTMLDivElement | any>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tl = useRef<gsap.core.Timeline | undefined>();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsActive(!isActive);
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  useGSAP(
    () => {
      gsap.set(".menu-link-item-holder", { y: 75 });
      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", {
          duration: 1.25,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        })
        .to(".menu-link-item-holder", {
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: -0.75,
        });
    },
    { scope: container },
  );

  useEffect(() => {
    if (isMenuOpen) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed transition-all duration-300 w-full md:px-12 px-8 box-border flex items-center justify-center bg-light z-50`}
      ref={container}
    >
      <div className="w-full flex justify-start">
        <div className={styles.logo}>
          <Link href={"/"} className={styles.name}>
            <p className={styles.leonardo}>Leonardo</p>
            <p className={styles.parisi}>Parisi</p>
            <p className={styles.role}>Frontend developer</p>
          </Link>
        </div>
      </div>
      <div className="md:flex justify-center gap-4 md:rounded-none rounded-full md:border-none border relative hidden md:w-full">
        {!home ? (
          <Link
            href={{ pathname: "/" }}
            className={`text-dark hover:text-orange transition-all duration-500 text-base font-bold font-questrial  `}
          >
            Home
          </Link>
        ) : (
          <Link
            href={{ pathname: "/about" }}
            className={`text-dark hover:text-orange transition-all duration-500 text-base font-bold font-questrial  `}
          >
            About
          </Link>
        )}
      </div>
      <div className="w-full max-md:w-fit flex justify-end gap-4">
        <button
          className={`hamburger ${isActive && "active"}`}
          onClick={toggleMenu}
        ></button>
      </div>
      <div className="menu-overlay">
        <div className="menu-close-icon absolute right-12" onClick={toggleMenu}>
          <TfiClose className="text-light md:text-[100px] text-[75px]" />
        </div>
        {/* menu overlay items */}
        <div className="menu-copy">
          <div className="flex flex-col items-center gap-6 menu-links select-none">
            {data.menuLinks.map((link: any, i: any) => (
              <div className="relative" key={i}>
                {path == link.path && (
                  <div className="absolute top-[40%] -left-14 h-6 w-6 rounded-full bg-light z-50" />
                )}
                <div className="menu-link-item">
                  <div
                    className="relative menu-link-item-holder"
                    onClick={toggleMenu}
                  >
                    <Link
                      className=" text-light text-[130px] font-source leading-[80%]"
                      href={link.path}
                      id={"active"}
                    >
                      {link.label}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex max-sm:items-end w-full md:gap-6 justify-between text-light sm:text-base text-[15px] font-medium select-none">
            <div className="flex flex-col w-fit">
              <p className="text-3xl max-sm:hidden">Leonardo Parisi</p>
              <Link href="mailto:parisii.leonardo@gmail.com" target="_top">
                parisii.leonardo@gmail.com
              </Link>
              <Link
                href={`https://${process.env.NEXT_PUBLIC_DOMAIN || "imleo.it"}`}
              >
                {process.env.NEXT_PUBLIC_DOMAIN || "imleo.it"}
              </Link>
            </div>
            <div className="flex flex-col justify-end w-fit">
              <Link href="https://twitter.com/_leoparisi" target="_blank">
                X
              </Link>
              <Link
                href="https://www.instagram.com/leonardo.parisi__/"
                target="_blank"
              >
                Instagram
              </Link>
              <Link
                href="https://www.linkedin.com/in/leonardo-parisi-4a0121237/"
                target="_blank"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

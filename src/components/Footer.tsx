"use client";
import Link from "next/link";
import socialsData from "@/data/data.json";
import Text from "./ui/Text";
import Button from "./ui/Button";

const Footer = () => {
  const dynamicCopyright = (
    <div>© {new Date().getFullYear()}. Created by Leonardo Parisi</div>
  );
  return (
    <div className="flex justify-center items-center sm:p-4 p-3 w-full max-sm:pb-[58px]">
      <div className="flex flex-col gap-8 justify-between md:px-16 px-6 md:py-16 py-10 w-full mt-18 bg-dark sm:rounded-[28px] rounded-lg">
        <div className=" flex flex-col gap-8 w-full">
          <Text
            text="Leonardo Parisi"
            className="md:text-4xl text-3xl font-black text-light font-source"
          />
          <div className="border-b border-light md:w-[500px] w-full font-questrial md:text-xl sm:text-base text-sm py-2 font-medium flex items-center justify-between text-light">
            parisii.leonardo@gmail.com
            <Button
              title="Get in touch!"
              link="mailto:parisii.leonardo@gmail.com"
              className="bg-light hover:bg-dark hover:text-light border-0 hover:outline outline-light outline-1 md:px-6 px-4 sm:py-3 py-2 md:text-base text-sm transition-all duration-500"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Text
            text={dynamicCopyright}
            className="text-sm sm:text-md font-bold text-light"
          />
          <div className="w-fit flex justify-end items-end gap-4">
            {socialsData.socials.map((social) => (
              <Link key={social.name} href={social.url} target="_blank">
                <div className="text-lg text-light hover:text-orange transition-all duration-500">
                  <i className={`bi bi-${social.icon}`}></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

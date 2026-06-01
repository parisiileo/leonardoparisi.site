import classNames from "classnames";
import React from "react";
import Button from "./ui/Button";
import Link from "next/link";
import { CardProps } from "@/types/index";

const Card = ({
  workType,
  title,
  label,
  desc,
  dates,
  url,
  type,
  stack,
  link,
  ...props
}: CardProps) => {
  const isSingleYear = dates.from === dates.to;
  const formattedDate = isSingleYear
    ? dates.from
    : `${dates.from} - ${dates.to}`;
  return (
    <div
      className={classNames(
        "w-full flex flex-col py-8 gap-4",
        workType == "work" && "border-b-2 border-dark gap-8",
      )}
      {...props}
    >
      {workType == "work" ? (
        <div className="flex justify-between w-full">
          <div className="w-fit flex flex-col gap-3">
            <div className="relative flex w-fit items-center">
              <div className="md:text-[44px] text-4xl max-xs:text-[32px] font-semibold font-source sm:text-nowrap">
                {title}
              </div>
              <Link
                href={link}
                target="_blank"
                className="absolute -top-3 -right-8 underline font-questrial text-lg rounded-full"
              >
                Visit
              </Link>
            </div>
            <div className="font-questrial md:text-2xl sm:text-[22px] text-lg">
              {label}
            </div>
          </div>
          <div className="w-fit flex flex-col items-end gap-3 font-questrial md:text-[22px] sm:text-xl text-lg py-2">
            <div className="w-fit">{formattedDate}</div>
            <div>{type}</div>
          </div>
        </div>
      ) : (
        <div className="text-[40px] font-semibold font-source">{title}</div>
      )}
      <div className="flex lg:gap-24 sm:gap-8 gap-6 max-lg:flex-col-reverse">
        <div
          className={classNames(
            workType == "work" && "md:max-w-[80%]",
            "font-questrial md:text-xl text-lg w-full",
          )}
        >
          {desc}
        </div>
        {workType == "side" && (
          <div className="w-fit flex flex-col gap-3 font-questrial text-xl">
            <div className="font-questrial">{label}</div>
            <div className="flex w-fit gap-1.5">
              <div className="w-full">{dates.from}</div>
              <div>-</div>
              <div className={classNames(dates.to == "Present" && "underline")}>
                {dates.to}
              </div>
            </div>
          </div>
        )}
      </div>
      {workType == "work" && (
        <div className="flex flex-wrap gap-2">
          {stack.map((item, i) => (
            <Button
              key={i}
              title={item}
              className="rounded-full py-1.5 px-3 bg-dark text-neutral-300 font-thin font-questrial md:text-base text-[15px] max-xs:text-sm"
            ></Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;

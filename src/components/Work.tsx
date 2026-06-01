"use client";
import React, { useRef } from "react";
import data from "../data/data.json";
import Card from "./Card";
import Title from "./ui/Title";

const Work = () => {
  const titleRef = useRef(null);
  const parseYear = (year: string) =>
    year === "Present" ? 9999 : Number(year) || 0;

  const sortedWork = [...data.projects.work].sort((a, b) => {
    const aTo = parseYear(a.to);
    const bTo = parseYear(b.to);
    if (aTo !== bTo) return bTo - aTo;
    return parseYear(b.from) - parseYear(a.from);
  });

  return (
    <div className="max-sm:w-screen p-2">
      <Title text="Work Experience" reference={titleRef} />
      <div className="flex flex-col md:gap-12 gap-8 md:py-8 py-4 w-full">
        <ol className="flex flex-col gap-8 w-full">
          {sortedWork.map((project, i) => (
            <li key={i} className="w-full">
              <Card
                workType="work"
                title={project.title}
                label={project.label}
                desc={project.desc}
                dates={{
                  from: project.from,
                  to: project.to,
                }}
                url={project.url}
                type={project.type}
                stack={project.stack}
                {...(project.link && { link: project.link })}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Work;

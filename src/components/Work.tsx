"use client";
import React, { useRef } from "react";
import data from "../data/data.json";
import Card from "./Card";
import Title from "./ui/Title";

const Work = () => {
  const titleRef = useRef(null);

  return (
    <div className="w-screen p-2">
      <Title text="Work Experience" reference={titleRef} />
      <div className="flex flex-col md:gap-12 gap-8 md:py-8 py-4 w-full">
        {data.projects.work.map((project, i) => (
          <Card
            workType="work"
            key={i}
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
        ))}
      </div>
      <div className="md:py-32 py-20">
        <h1 className="text-5xl font-source">Side Projects</h1>
        <div className="flex flex-col md:gap-12 gap-8 md:py-8 py-4 w-full">
          {data.projects.side.map((project, i) => (
            <Card
              workType="side"
              key={i}
              title={project.title}
              label={project.label}
              desc={project.desc}
              dates={{
                from: project.from,
                to: project.to,
              }}
              url={project.url}
              type={project.type}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

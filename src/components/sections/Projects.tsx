"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import Magnetic from "@/components/ui/Magnetic";
import Scramble from "@/components/ui/Scramble";
import data from "@/data/data.json";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { SECTION_HUES } from "@/lib/sections";

type Project = (typeof data.projects)[number];

export default function Projects() {
  const t = useTranslations("projects");

  return (
    <section
      id="projects"
      data-sec="projects"
      data-hue={SECTION_HUES.projects}
      className="bg-bg relative px-[clamp(16px,3vw,40px)] pt-[clamp(60px,10vh,120px)]"
    >
      <div className="border-line flex flex-wrap items-end justify-between gap-5 border-b pb-[22px]">
        <h2 className="font-display m-0 text-[clamp(38px,6.3vw,99px)] leading-[0.86] font-black tracking-[-0.05em] uppercase">
          {t("headingLine1")}
          <br />
          {t("headingLine2")}
        </h2>
        <div className="text-mut max-w-[30ch] font-mono text-[11px] leading-[1.9] tracking-[0.2em]">
          <Scramble text={t("meta")} />
          <br />
          {t("range")}
        </div>
      </div>

      <div className="pt-[clamp(30px,6vh,70px)]">
        {data.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="h-[20vh]" />
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("projects");
  const ref = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();

  const applyTilt = (event: React.MouseEvent) => {
    const el = ref.current;
    if (!isDesktop || !el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1400px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(-py * 4).toFixed(2)}deg) scale(1.005)`;
    el.style.borderColor = "var(--ac)";
  };

  const resetTilt = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      "perspective(1400px) rotateY(0deg) rotateX(0deg) scale(1)";
    el.style.borderColor = "var(--color-line)";
  };

  const textColumn = (
    <div
      className={`flex flex-col justify-between gap-6 p-[clamp(22px,3vw,44px)] ${
        project.mediaFirst ? "min-[860px]:order-2" : ""
      }`}
    >
      <div className="text-mut flex justify-between font-mono text-[11px] tracking-[0.2em]">
        <span>
          {String(data.projects.indexOf(project) + 1).padStart(2, "0")}
        </span>
        <span className="text-ac">
          {t(`items.${project.id}.category` as "items.fmshop.category")}
        </span>
      </div>
      <div>
        <h3 className="font-display m-0 mb-[14px] text-[clamp(31px,4.7vw,72px)] leading-[0.86] font-black tracking-[-0.045em] uppercase">
          {project.title}
        </h3>
        <p className="text-mut m-0 mb-[22px] max-w-[44ch] text-[clamp(14px,1.2vw,17px)] leading-[1.6] text-pretty">
          {t(`items.${project.id}.desc` as "items.fmshop.desc")}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="border-line text-mut rounded-full border px-[13px] py-[7px] font-mono text-[11px]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <Magnetic>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="border-ac text-ac flex w-fit items-center gap-[10px] rounded-full border px-5 py-[13px] font-mono text-[11.5px] tracking-[0.18em]"
        >
          {t("visit")} →
        </a>
      </Magnetic>
    </div>
  );

  const mediaColumn = (
    <div
      className={`relative flex items-end p-[18px] ${
        project.mediaFirst ? "min-[860px]:order-1" : ""
      }`}
      style={
        project.shot
          ? undefined
          : {
              background: "#0e0e10",
              backgroundImage: `repeating-linear-gradient(${project.hatch}deg, rgba(244,242,238,.055) 0 2px, transparent 2px 13px)`,
            }
      }
    >
      {project.shot ? (
        <Image
          src={project.shot}
          alt={project.title}
          fill
          sizes="(max-width: 860px) 100vw, 50vw"
          className="object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
        />
      ) : (
        <span className="border-line text-mut2 rounded border border-dashed px-[11px] py-[7px] font-mono text-[10.5px] tracking-[0.2em]">
          {t("shotPlaceholder")}
        </span>
      )}
    </div>
  );

  return (
    <article
      ref={ref}
      data-tilt
      onMouseMove={applyTilt}
      onMouseLeave={resetTilt}
      className={`border-line bg-surf relative mb-[26px] grid min-h-[min(72vh,620px)] overflow-hidden rounded-[10px] border transition-[transform,border-color] duration-500 md:sticky ${
        project.mediaFirst
          ? "min-[860px]:grid-cols-[.95fr_1.05fr]"
          : "min-[860px]:grid-cols-[1.05fr_.95fr]"
      }`}
      style={{
        top: `${project.stickyTop}px`,
        transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
      }}
    >
      {textColumn}
      {mediaColumn}
    </article>
  );
}

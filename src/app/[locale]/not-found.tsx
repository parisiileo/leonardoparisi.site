import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("nav");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-ac font-mono text-[11px] tracking-[0.22em]">
        ERROR 404
      </p>
      <h1 className="font-display m-0 text-[clamp(47px,10.8vw,162px)] leading-[0.84] font-black tracking-[-0.055em] uppercase">
        Lost the
        <br />
        <span className="font-normal normal-case italic">thread.</span>
      </h1>
      <p className="text-mut max-w-[42ch] text-[clamp(14px,1.3vw,17px)]">
        That page doesn&apos;t exist — it may have moved when the site became a
        single scroll.
      </p>
      <Link
        href="/"
        className="bg-ac text-ac-t rounded-full px-6 py-[15px] font-mono text-[12px] font-medium tracking-[0.18em]"
      >
        {t("work")} →
      </Link>
    </div>
  );
}

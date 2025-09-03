"use client";
import Link from "next/link";
import Text from "./ui/Text";
import Title from "./ui/Title";
import { useRef } from "react";

const Contact = () => {
  const titleRef = useRef(null);
  const text = (
    <p className="text-xl">
      Feel free to contact me at the emails below, otherwise <br />
      you can contact me on{" "}
      <Link
        target="__blank"
        href="https://discord.com/users/657671413947301959"
        className="text-dark font-semibold font-questrial underline"
      >
        Discord
      </Link>{" "}
      too.
    </p>
  );

  const email = (
    <p className="text-dark text-lg font-semibold font-questrial underline">
      parisii.leonardo@gmail.com
    </p>
  );

  return (
    <div className="flex flex-col gap-2 w-screen p-2" id="contacts">
      <div className="flex flex-col">
        <div>
          <Title text="Contacts" reference={titleRef} />
          <div className="pt-16">
            <Text text={text} className="font-medium" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 text-xl font-questrial text-dark">
        Email:
        <Link href="mailto:parisii.leonardo@gmail.com" target="__blank">
          {email}
        </Link>
      </div>
      <div className="text-lg font-questrial text-dark">
        <Link href={"/about"} className="underline">
          About page
        </Link>{" "}
        for more <br className="xs:hidden" /> information about me :)
      </div>
    </div>
  );
};

export default Contact;

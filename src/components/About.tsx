import Link from "next/link";
import Text from "./ui/Text";
import Title from "./ui/Title";

const About = () => {
  const text = (
    <p className="text-[17px]" id="about">
      I'm Leonardo Parisi, a deeply passionate Frontend developer. <br />
      I like to build dynamic and engaging user experiences through
      <br />
      my proficiency with the best and latest technologies . <br />
      With a keen eye for design aesthetics and a commitment <br />
      to staying updated with the latest web development trends, <br />
      I consistently strive to transform intricate ideas into intuitive, <br />
      visually appealing digital solutions.
    </p>
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div>
        <Title
          text="About."
          className="font-semibold text-[40px] text-dark font-questrial mb-3"
        />
      </div>
      <div>
        <Text text={text} />
      </div>
    </div>
  );
};

export default About;

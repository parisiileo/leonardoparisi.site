export interface TextProps {
  text: string | any;
  secondaryText?: string | any;
  className?: string;
}

export interface ButtonProps {
  title: string;
  className?: string;
  link?: string;
  onClick?: () => void;
}

export type CardProps = {
  workType: "work" | "side";
  title: string;
  label: string;
  desc: string;
  dates: {
    from: string;
    to: string;
  };
  url: string;
  type: string;
  link?: any;
} & (
  | { workType: "work"; stack: string[] }
  | { workType: "side"; stack?: string[] }
);

export interface TitleProps {
  text: string;
  reference?: any;
  className?: string;
  border?: boolean;
  delay?: number;
  viewMargin?: any;
}

export interface ContainerProps {
  children: React.ReactNode;
}

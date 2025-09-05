import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-muted-foreground py-6 text-center text-sm mt-auto border-t">
      <p className="mb-1">
        &copy; {new Date().getFullYear()} AuthKit. All rights reserved.
      </p>

      <p className="mb-1 inline-flex items-center justify-center gap-1">
        Made by{" "}
        <span className="font-medium text-foreground ml-1">Aquib Jawed</span>
      </p>

      <p className="flex items-center justify-center gap-2 group transition-colors duration-150">
        <Mail className="w-4 h-4 text-muted-foreground relative top-[1px] group-hover:text-primary" />
        <a
          href="mailto:info.aquibjawed@gmail.com"
          className="underline underline-offset-4 hover:text-primary transition-colors"
        >
          Contact Me
        </a>
      </p>
    </footer>
  );
};

export default Footer;

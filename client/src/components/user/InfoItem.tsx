import { Globe, Twitter, Linkedin, Instagram, Github } from "lucide-react";
import type { JSX } from "react";

const iconMap : Record<string, JSX.Element > = {
  Website: <Globe className="w-4 h-4 mr-2" />,
  Twitter: <Twitter className="w-4 h-4 mr-2" />,
  LinkedIn: <Linkedin className="w-4 h-4 mr-2" />,
  Instagram: <Instagram className="w-4 h-4 mr-2" />,
  GitHub: <Github className="w-4 h-4 mr-2" />,
};

const InfoItem = ({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value?: string;
  isLink?: boolean;
}) => {
  const icon = isLink ? iconMap[label] : null;

  return (
    <div className="flex items-start">
      {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}

      <div>
        <span className="font-medium text-foreground block mb-0.5">
          {!isLink && `${label}:`}
        </span>
        {value ? (
          isLink ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition break-all"
            >
              {value}
            </a>
          ) : (
            <p className="text-muted-foreground">{value}</p>
          )
        ) : (
          <p className="text-muted-foreground">—</p>
        )}
      </div>
    </div>
  );
};

export default InfoItem;

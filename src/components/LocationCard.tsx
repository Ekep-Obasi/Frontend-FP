import { MapPin, ExternalLink, CloudSun, Star } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

type LocationCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  ratingCount?: number;
  footer?: ReactNode;
  onClick?: () => void;
};

export default function LocationCard({
  title,
  subtitle,
  description,
  imageUrl,
  rating,
  ratingCount,
  footer,
  onClick,
}: LocationCardProps) {
  return (
    <div
      className="rounded-xl border border-border hover:shadow-md transition bg-background cursor-pointer"
      onClick={onClick}
    >
      {imageUrl && (
        <div className="h-36 w-full overflow-hidden rounded-t-xl relative">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
        </div>
      )}
      <div className="p-4 flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{title}</div>
          {subtitle && (
            <div className="text-sm text-zinc-500 truncate">{subtitle}</div>
          )}
          {typeof rating === "number" && (
            <div className="text-xs mt-1 inline-flex items-center gap-1 text-yellow-700 dark:text-yellow-300">
              <Star className="w-3 h-3 fill-current" />
              {rating} {ratingCount ? `(${ratingCount})` : null}
            </div>
          )}
          {description && (
            <p className="text-sm mt-2 line-clamp-3 text-muted-foreground">
              {description}
            </p>
          )}
          {footer && (
            <div className="mt-3 text-sm flex items-center gap-2 text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

export function WeatherBadge({
  tempC,
  summary,
}: {
  tempC?: number;
  summary?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted text-foreground px-2 py-0.5 text-xs font-medium">
      <CloudSun className="w-3 h-3" />
      {tempC !== undefined ? `${Math.round(tempC)}°C` : "—"}
      {summary ? `· ${summary}` : null}
    </span>
  );
}

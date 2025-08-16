import { CloudSun, Star } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";

type LocationCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  ratingCount?: number;
  footer?: ReactNode;
  onClick?: () => void;
  size?: "default" | "hero";
  loading?: boolean;
};

export default function LocationCard({
  title,
  subtitle,
  description,
  imageUrl,
  rating,
  ratingCount,
  onClick,
  size = "default",
  loading = false,
}: LocationCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (loading) {
    return (
      <div
        className={
          size === "hero"
            ? "rounded-2xl border border-border bg-background"
            : "rounded-xl border border-border bg-background"
        }
      >
        <div
          className={
            size === "hero"
              ? "h-56 w-full overflow-hidden rounded-t-2xl bg-muted animate-pulse"
              : "h-36 w-full overflow-hidden rounded-t-xl bg-muted animate-pulse"
          }
        />
        <div className={size === "hero" ? "p-5" : "p-4"}>
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-muted rounded mt-3 animate-pulse" />
          <div className="h-3 w-full bg-muted rounded mt-4 animate-pulse" />
          <div className="h-3 w-5/6 bg-muted rounded mt-2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        size === "hero"
          ? "rounded-2xl border border-border hover:shadow-xl transition bg-background cursor-pointer"
          : "rounded-xl border border-border hover:shadow-md transition bg-background cursor-pointer"
      }
      onClick={onClick}
    >
      {imageUrl && (
        <div
          className={
            size === "hero"
              ? "h-56 w-full overflow-hidden rounded-t-2xl relative"
              : "h-36 w-full overflow-hidden rounded-t-xl relative"
          }
        >
          <div
            className={
              "absolute inset-0 bg-muted transition-opacity duration-300 " +
              (isImageLoaded ? "opacity-0" : "opacity-100 animate-pulse")
            }
          />
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={size === "hero"}
            onLoadingComplete={() => setIsImageLoaded(true)}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzE3MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZWVlJy8+PC9zdmc+"
          />
        </div>
      )}
      <div
        className={
          size === "hero"
            ? "p-5 flex items-start gap-3"
            : "p-4 flex items-start gap-3"
        }
      >
        <div className="flex-1 min-w-0">
          <div
            className={
              size === "hero"
                ? "font-semibold text-lg truncate"
                : "font-semibold truncate"
            }
          >
            {title}
          </div>
          {subtitle && (
            <div className="text-sm text-zinc-500 truncate">{subtitle}</div>
          )}
          {typeof rating === "number" && (
            <div className="text-xs mt-1 inline-flex items-center gap-1 text-yellow-700 dark:text-yellow-300">
              <Star
                className={
                  size === "hero"
                    ? "w-4 h-4 fill-current"
                    : "w-3 h-3 fill-current"
                }
              />
              {rating} {ratingCount ? `(${ratingCount})` : null}
            </div>
          )}
          {description && (
            <p className="text-sm mt-2 line-clamp-3 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
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

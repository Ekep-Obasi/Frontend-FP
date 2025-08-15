export function buildPhotoUrl(photoReference: string, maxWidth = 600) {
  return `/api/places/photo?maxwidth=${maxWidth}&ref=${encodeURIComponent(photoReference)}`;
}

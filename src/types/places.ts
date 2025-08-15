export type PlacePhoto = {
  photo_reference?: string;
};

export type PlaceGeometry = {
  location?: { lat: number; lng: number };
};

export type PlaceSearchResult = {
  place_id: string;
  name: string;
  formatted_address?: string;
  vicinity?: string;
  photos?: PlacePhoto[];
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  geometry?: PlaceGeometry;
};

export type PlacesSearchResponse = {
  results?: PlaceSearchResult[];
  candidates?: PlaceSearchResult[];
  status?: string;
  error_message?: string;
};

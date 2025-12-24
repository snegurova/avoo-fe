export interface NominatimAddress {
  house_number?: string;
  house?: string;
  road?: string;
  street?: string;
  residential?: string;
  pedestrian?: string;
  footway?: string;
  name?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  municipality?: string;
  state?: string;
  region?: string;
  postcode?: string;
  country?: string;
}

export interface NominatimPlace {
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: NominatimAddress;
}

import type { NominatimPlace, NominatimAddress } from '../types/geocode';

function getAddress(place?: NominatimPlace): NominatimAddress {
  if (!place) return {};
  return place.address ?? {};
}

export function buildShortAddress(place?: NominatimPlace) {
  const addr = getAddress(place);

  const {
    house_number,
    house,
    road: r_road,
    street,
    residential,
    pedestrian,
    footway,
    name,
    city,
    town,
    village,
    county,
    municipality,
    state,
    region,
    postcode,
    country,
  } = addr;

  const housePart = house_number ?? house;
  const roadPart = r_road ?? street ?? residential ?? pedestrian ?? footway ?? name;
  const cityPart = city ?? town ?? village ?? county ?? municipality;
  const statePart = state ?? region;

  const parts: string[] = [];
  if (housePart && roadPart) parts.push(`${housePart}, ${roadPart}`);
  else if (roadPart) parts.push(String(roadPart));
  if (cityPart) parts.push(String(cityPart));
  if (statePart) parts.push(String(statePart));
  if (postcode) parts.push(String(postcode));
  if (country) parts.push(String(country));

  return parts.join(', ');
}

export const formatAddressUtils = {
  buildShortAddress,
};

export default formatAddressUtils;

interface GeoLocationResponse {
  status: "success" | "fail";
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export const getGeoLocation = async (ip: string) => {
  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const data: GeoLocationResponse = await res.json();

  return {
    country: data.country,
    region: data.region,
    regionName: data.regionName,
    city: data.city,
    zip: parseInt(data.zip),
    timezone: data.timezone,
  };
};

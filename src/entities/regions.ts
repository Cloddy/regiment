import { ApiResponse } from '@ktsstudio/mediaproject-utils';

export type ApiCountryKeyType = number | null;

export type ApiCountryType = {
  key: ApiCountryKeyType;
  name: string;
};

export type ApiCountriesResponse = ApiResponse<{ countries: ApiCountryType[] }>;

export type ApiRegionIDType = string;

export type ApiRegionType = { id: ApiRegionIDType; name: string };

export type ApiRegionsResponse = ApiResponse<{ regions: ApiRegionType[] }>;

export type LoadCountriesValueType = {
  initialCountry: ApiCountryType;
};

export type ApiSelectRegionResponse = ApiResponse<Record<string, unknown>>;

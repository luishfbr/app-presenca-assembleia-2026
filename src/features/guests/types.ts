import type { Guest } from "@/db/schema/presence/guests";

export type GetGuestsResponse = {
  data: Guest[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type ImportGuestsResponse = {
  inserted: number;
  duplicates: number;
  errors: { row: number; document: string; reason: string }[];
};

export type ParsedGuestRow = {
  name: string;
  document: string;
  type: string;
};

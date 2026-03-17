import type { Checkin } from "@/db/schema/presence/checkins";
import type { Guest } from "@/db/schema/presence/guests";
import type { User } from "@/server/auth";

export type CheckinWithRelations = Checkin & {
  guest: Guest;
  user: User;
};

export type GetCheckinsResponse = {
  data: CheckinWithRelations[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type CheckinStatsResponse = {
  data: {
    totalCheckins: number;
    myCheckins: number;
  };
};

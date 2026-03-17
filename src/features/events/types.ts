import type { Event } from "@/db/schema/presence/events";
import type { EventUser } from "@/db/schema/presence/event-users";
import type { User } from "@/server/auth";

export type GetEventsResponse = {
  data: Event[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type EventWithStats = Event & {
  totalGuests: number;
  totalCheckins: number;
};

export type GetEventsWithStatsResponse = {
  data: EventWithStats[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export type EventUserWithUser = EventUser & {
  user: Pick<User, "id" | "name" | "email" | "username" | "role">;
};

export type GetEventUsersResponse = {
  data: EventUserWithUser[];
};

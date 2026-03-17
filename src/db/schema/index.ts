import { accounts } from "./auth/accounts";
import {
  accountsRelations,
  sessionsRelations,
  usersRelations,
} from "./auth/auth-relations";
import { sessions } from "./auth/sessions";
import { users } from "./auth/users";
import { verifications } from "./auth/verifications";
import { checkins, checkinsRelations } from "./presence/checkins";
import { guests, guestsRelations } from "./presence/guests";
import { events, eventsRelations } from "./presence/events";
import { eventUsers, eventUsersRelations } from "./presence/event-users";
import { siteConfig } from "./presence/site-config";

export const schema = {
  users,
  sessions,
  accounts,
  verifications,
  usersRelations,
  sessionsRelations,
  accountsRelations,
  events,
  eventsRelations,
  eventUsers,
  eventUsersRelations,
  guests,
  guestsRelations,
  checkins,
  checkinsRelations,
  siteConfig,
};

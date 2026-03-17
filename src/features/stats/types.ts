export const RECENT_CHECKINS_LIMIT = 15;

export type CheckinsByUserItem = {
  userId: string;
  userName: string | null;
  count: number;
};

export type CheckinsByHourItem = {
  hour: number;
  label: string;
  count: number;
};

export type RecentCheckinItem = {
  id: string;
  guestName: string;
  guestDocument: string;
  /** Tipo do convidado conforme cadastrado (ex.: "Membro", "Convidado"). Valor livre definido no cadastro. */
  guestType: string;
  userName: string | null;
  createdAt: string;
};

export type StatsData = {
  totalCheckins: number;
  totalGuests: number;
  attendanceRate: number;
  checkinsByUser: CheckinsByUserItem[];
  checkinsByHour: CheckinsByHourItem[];
  recentCheckins: RecentCheckinItem[];
};

export type GetStatsResponse = {
  data: StatsData;
};

export type CheckinsByEventItem = {
  eventName: string;
  eventSlug: string;
  totalCheckins: number;
  totalGuests: number;
  attendanceRate: number;
};

export type GlobalRecentCheckinItem = RecentCheckinItem & {
  eventName: string;
  eventSlug: string;
};

export type GlobalStatsData = {
  totalEvents: number;
  totalGuests: number;
  totalCheckins: number;
  attendanceRate: number;
  checkinsByEvent: CheckinsByEventItem[];
  checkinsByUser: CheckinsByUserItem[];
  recentCheckins: GlobalRecentCheckinItem[];
};

export type GetGlobalStatsResponse = {
  data: GlobalStatsData;
};

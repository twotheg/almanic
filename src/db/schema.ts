import { integer, pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id", { length: 64 }).notNull(),
  levelId: integer("level_id").notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }).defaultNow().notNull(),
  bestTimeSeconds: integer("best_time_seconds"),
}, (table) => ({
  deviceLevelIdx: uniqueIndex("device_level_idx").on(table.deviceId, table.levelId),
}));

export const pushSubscriptionsTable = pgTable("push_subscriptions", {
  id: serial("id").primaryKey(),
  deviceId: varchar("device_id", { length: 64 }).notNull(),
  endpoint: varchar("endpoint", { length: 512 }).notNull(),
  p256dh: varchar("p256dh", { length: 256 }).notNull(),
  auth: varchar("auth", { length: 128 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  endpointIdx: uniqueIndex("endpoint_idx").on(table.endpoint),
}));

export type Progress = typeof progressTable.$inferSelect;
export type NewProgress = typeof progressTable.$inferInsert;
export type PushSubscription = typeof pushSubscriptionsTable.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptionsTable.$inferInsert;

import {
    int,
    mysqlTable,
    serial,
    timestamp,
    varchar,
} from "drizzle-orm/mysql-core";
import { rooms } from "./room";

export const Course = mysqlTable("courses", {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    start: timestamp("start").notNull(),
    end: timestamp("end"),
    kind: varchar("kind", { length: 100 }).notNull(),
    status: varchar("status", { length: 100 }).notNull(),
    lang: varchar("lang", { length: 10 }).notNull(),
    // uploadId: int("upload_id"),
    roomId: int("room_id").references(() => rooms.id),
});

export const CourseParticipant = mysqlTable("course_participants", {
    id: int("id").primaryKey(),
    userId: int("user_id"),
    courseId: int("course_id").notNull(),
    status: varchar("status", { length: 50 }),
    subscriptionId: int("subscription_id"),
});

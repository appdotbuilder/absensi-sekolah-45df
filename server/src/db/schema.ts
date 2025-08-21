import { serial, text, pgTable, timestamp, boolean, integer, pgEnum, date, time, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['STUDENT', 'TEACHER', 'ADMIN']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['PRESENT', 'LATE', 'ABSENT', 'EXCUSED']);
export const leaveRequestStatusEnum = pgEnum('leave_request_status', ['PENDING', 'APPROVED', 'REJECTED']);
export const leaveRequestTypeEnum = pgEnum('leave_request_type', ['SICK', 'PERMISSION', 'FAMILY_MATTER', 'OTHER']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: text('password').notNull(), // Will store hashed password
  full_name: text('full_name').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Students table
export const studentsTable = pgTable('students', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  student_id: varchar('student_id', { length: 20 }).notNull().unique(),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  parent_phone: varchar('parent_phone', { length: 20 }),
  enrollment_date: date('enrollment_date').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Teachers table
export const teachersTable = pgTable('teachers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  teacher_id: varchar('teacher_id', { length: 20 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  subject_specialization: varchar('subject_specialization', { length: 100 }),
  hire_date: date('hire_date').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Classes table
export const classesTable = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  grade_level: varchar('grade_level', { length: 20 }).notNull(),
  class_teacher_id: integer('class_teacher_id').references(() => teachersTable.id),
  academic_year: varchar('academic_year', { length: 20 }).notNull(),
  max_students: integer('max_students').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Subjects table
export const subjectsTable = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Schedules table
export const schedulesTable = pgTable('schedules', {
  id: serial('id').primaryKey(),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  subject_id: integer('subject_id').notNull().references(() => subjectsTable.id),
  teacher_id: integer('teacher_id').notNull().references(() => teachersTable.id),
  day_of_week: integer('day_of_week').notNull(), // 1 = Monday, 7 = Sunday
  start_time: time('start_time').notNull(),
  end_time: time('end_time').notNull(),
  room: varchar('room', { length: 50 }),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Attendance table
export const attendanceTable = pgTable('attendance', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentsTable.id),
  schedule_id: integer('schedule_id').notNull().references(() => schedulesTable.id),
  attendance_date: date('attendance_date').notNull(),
  check_in_time: timestamp('check_in_time', { withTimezone: true }),
  check_out_time: timestamp('check_out_time', { withTimezone: true }),
  status: attendanceStatusEnum('status').notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Leave Requests table
export const leaveRequestsTable = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentsTable.id),
  request_type: leaveRequestTypeEnum('request_type').notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  reason: text('reason').notNull(),
  status: leaveRequestStatusEnum('status').notNull().default('PENDING'),
  approved_by: integer('approved_by').references(() => usersTable.id),
  approval_notes: text('approval_notes'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [usersTable.id],
    references: [studentsTable.user_id]
  }),
  teacher: one(teachersTable, {
    fields: [usersTable.id],
    references: [teachersTable.user_id]
  })
}));

export const studentsRelations = relations(studentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentsTable.user_id],
    references: [usersTable.id]
  }),
  class: one(classesTable, {
    fields: [studentsTable.class_id],
    references: [classesTable.id]
  }),
  attendance: many(attendanceTable),
  leaveRequests: many(leaveRequestsTable)
}));

export const teachersRelations = relations(teachersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [teachersTable.user_id],
    references: [usersTable.id]
  }),
  managedClasses: many(classesTable),
  schedules: many(schedulesTable)
}));

export const classesRelations = relations(classesTable, ({ one, many }) => ({
  classTeacher: one(teachersTable, {
    fields: [classesTable.class_teacher_id],
    references: [teachersTable.id]
  }),
  students: many(studentsTable),
  schedules: many(schedulesTable)
}));

export const subjectsRelations = relations(subjectsTable, ({ many }) => ({
  schedules: many(schedulesTable)
}));

export const schedulesRelations = relations(schedulesTable, ({ one, many }) => ({
  class: one(classesTable, {
    fields: [schedulesTable.class_id],
    references: [classesTable.id]
  }),
  subject: one(subjectsTable, {
    fields: [schedulesTable.subject_id],
    references: [subjectsTable.id]
  }),
  teacher: one(teachersTable, {
    fields: [schedulesTable.teacher_id],
    references: [teachersTable.id]
  }),
  attendance: many(attendanceTable)
}));

export const attendanceRelations = relations(attendanceTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [attendanceTable.student_id],
    references: [studentsTable.id]
  }),
  schedule: one(schedulesTable, {
    fields: [attendanceTable.schedule_id],
    references: [schedulesTable.id]
  })
}));

export const leaveRequestsRelations = relations(leaveRequestsTable, ({ one }) => ({
  student: one(studentsTable, {
    fields: [leaveRequestsTable.student_id],
    references: [studentsTable.id]
  }),
  approver: one(usersTable, {
    fields: [leaveRequestsTable.approved_by],
    references: [usersTable.id]
  })
}));

// TypeScript types for table operations
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type Student = typeof studentsTable.$inferSelect;
export type NewStudent = typeof studentsTable.$inferInsert;

export type Teacher = typeof teachersTable.$inferSelect;
export type NewTeacher = typeof teachersTable.$inferInsert;

export type Class = typeof classesTable.$inferSelect;
export type NewClass = typeof classesTable.$inferInsert;

export type Subject = typeof subjectsTable.$inferSelect;
export type NewSubject = typeof subjectsTable.$inferInsert;

export type Schedule = typeof schedulesTable.$inferSelect;
export type NewSchedule = typeof schedulesTable.$inferInsert;

export type Attendance = typeof attendanceTable.$inferSelect;
export type NewAttendance = typeof attendanceTable.$inferInsert;

export type LeaveRequest = typeof leaveRequestsTable.$inferSelect;
export type NewLeaveRequest = typeof leaveRequestsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  students: studentsTable,
  teachers: teachersTable,
  classes: classesTable,
  subjects: subjectsTable,
  schedules: schedulesTable,
  attendance: attendanceTable,
  leaveRequests: leaveRequestsTable
};
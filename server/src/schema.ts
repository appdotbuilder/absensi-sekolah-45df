import { z } from 'zod';

// User Role Enum
export const userRoleEnum = z.enum(['STUDENT', 'TEACHER', 'ADMIN']);
export type UserRole = z.infer<typeof userRoleEnum>;

// Attendance Status Enum
export const attendanceStatusEnum = z.enum(['PRESENT', 'LATE', 'ABSENT', 'EXCUSED']);
export type AttendanceStatus = z.infer<typeof attendanceStatusEnum>;

// Leave Request Status Enum
export const leaveRequestStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
export type LeaveRequestStatus = z.infer<typeof leaveRequestStatusEnum>;

// Leave Request Type Enum
export const leaveRequestTypeEnum = z.enum(['SICK', 'PERMISSION', 'FAMILY_MATTER', 'OTHER']);
export type LeaveRequestType = z.infer<typeof leaveRequestTypeEnum>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(), // Will be hashed
  full_name: z.string(),
  email: z.string().email(),
  role: userRoleEnum,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Student schema
export const studentSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  student_id: z.string(), // Student identification number
  class_id: z.number(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  parent_phone: z.string().nullable(),
  enrollment_date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Student = z.infer<typeof studentSchema>;

// Teacher schema
export const teacherSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  teacher_id: z.string(), // Teacher identification number
  phone: z.string().nullable(),
  address: z.string().nullable(),
  subject_specialization: z.string().nullable(),
  hire_date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Teacher = z.infer<typeof teacherSchema>;

// Class schema
export const classSchema = z.object({
  id: z.number(),
  name: z.string(),
  grade_level: z.string(),
  class_teacher_id: z.number().nullable(), // Foreign key to teachers table
  academic_year: z.string(),
  max_students: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Class = z.infer<typeof classSchema>;

// Subject schema
export const subjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Subject = z.infer<typeof subjectSchema>;

// Schedule schema
export const scheduleSchema = z.object({
  id: z.number(),
  class_id: z.number(),
  subject_id: z.number(),
  teacher_id: z.number(),
  day_of_week: z.number().int().min(1).max(7), // 1 = Monday, 7 = Sunday
  start_time: z.string(), // Time in HH:MM format
  end_time: z.string(), // Time in HH:MM format
  room: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Schedule = z.infer<typeof scheduleSchema>;

// Attendance schema
export const attendanceSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  schedule_id: z.number(),
  attendance_date: z.coerce.date(),
  check_in_time: z.coerce.date().nullable(),
  check_out_time: z.coerce.date().nullable(),
  status: attendanceStatusEnum,
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Attendance = z.infer<typeof attendanceSchema>;

// Leave Request schema
export const leaveRequestSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  request_type: leaveRequestTypeEnum,
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string(),
  status: leaveRequestStatusEnum,
  approved_by: z.number().nullable(), // Teacher/Admin user ID
  approval_notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type LeaveRequest = z.infer<typeof leaveRequestSchema>;

// Input schemas for authentication
export const loginInputSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Input schemas for user management
export const createUserInputSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  full_name: z.string().min(1),
  email: z.string().email(),
  role: userRoleEnum
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50).optional(),
  full_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Input schemas for student management
export const createStudentInputSchema = z.object({
  user: createUserInputSchema,
  student_id: z.string(),
  class_id: z.number(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  parent_phone: z.string().nullable().optional(),
  enrollment_date: z.coerce.date()
});

export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

export const updateStudentInputSchema = z.object({
  id: z.number(),
  class_id: z.number().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  parent_phone: z.string().nullable().optional()
});

export type UpdateStudentInput = z.infer<typeof updateStudentInputSchema>;

// Input schemas for teacher management
export const createTeacherInputSchema = z.object({
  user: createUserInputSchema,
  teacher_id: z.string(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  subject_specialization: z.string().nullable().optional(),
  hire_date: z.coerce.date()
});

export type CreateTeacherInput = z.infer<typeof createTeacherInputSchema>;

export const updateTeacherInputSchema = z.object({
  id: z.number(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  subject_specialization: z.string().nullable().optional()
});

export type UpdateTeacherInput = z.infer<typeof updateTeacherInputSchema>;

// Input schemas for class management
export const createClassInputSchema = z.object({
  name: z.string().min(1),
  grade_level: z.string().min(1),
  class_teacher_id: z.number().nullable().optional(),
  academic_year: z.string().min(1),
  max_students: z.number().int().positive()
});

export type CreateClassInput = z.infer<typeof createClassInputSchema>;

export const updateClassInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  grade_level: z.string().min(1).optional(),
  class_teacher_id: z.number().nullable().optional(),
  academic_year: z.string().min(1).optional(),
  max_students: z.number().int().positive().optional(),
  is_active: z.boolean().optional()
});

export type UpdateClassInput = z.infer<typeof updateClassInputSchema>;

// Input schemas for subject management
export const createSubjectInputSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().nullable().optional()
});

export type CreateSubjectInput = z.infer<typeof createSubjectInputSchema>;

export const updateSubjectInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  description: z.string().nullable().optional()
});

export type UpdateSubjectInput = z.infer<typeof updateSubjectInputSchema>;

// Input schemas for schedule management
export const createScheduleInputSchema = z.object({
  class_id: z.number(),
  subject_id: z.number(),
  teacher_id: z.number(),
  day_of_week: z.number().int().min(1).max(7),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  room: z.string().nullable().optional()
});

export type CreateScheduleInput = z.infer<typeof createScheduleInputSchema>;

export const updateScheduleInputSchema = z.object({
  id: z.number(),
  class_id: z.number().optional(),
  subject_id: z.number().optional(),
  teacher_id: z.number().optional(),
  day_of_week: z.number().int().min(1).max(7).optional(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  room: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateScheduleInput = z.infer<typeof updateScheduleInputSchema>;

// Input schemas for attendance management
export const checkInInputSchema = z.object({
  student_id: z.number(),
  schedule_id: z.number(),
  attendance_date: z.coerce.date()
});

export type CheckInInput = z.infer<typeof checkInInputSchema>;

export const checkOutInputSchema = z.object({
  attendance_id: z.number()
});

export type CheckOutInput = z.infer<typeof checkOutInputSchema>;

export const updateAttendanceInputSchema = z.object({
  id: z.number(),
  status: attendanceStatusEnum.optional(),
  notes: z.string().nullable().optional()
});

export type UpdateAttendanceInput = z.infer<typeof updateAttendanceInputSchema>;

// Input schemas for leave requests
export const createLeaveRequestInputSchema = z.object({
  student_id: z.number(),
  request_type: leaveRequestTypeEnum,
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string().min(1)
});

export type CreateLeaveRequestInput = z.infer<typeof createLeaveRequestInputSchema>;

export const processLeaveRequestInputSchema = z.object({
  id: z.number(),
  status: z.enum(['APPROVED', 'REJECTED']),
  approved_by: z.number(),
  approval_notes: z.string().nullable().optional()
});

export type ProcessLeaveRequestInput = z.infer<typeof processLeaveRequestInputSchema>;

// Query input schemas
export const getAttendanceByDateRangeInputSchema = z.object({
  student_id: z.number().optional(),
  class_id: z.number().optional(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date()
});

export type GetAttendanceByDateRangeInput = z.infer<typeof getAttendanceByDateRangeInputSchema>;

export const getScheduleByClassInputSchema = z.object({
  class_id: z.number(),
  day_of_week: z.number().int().min(1).max(7).optional()
});

export type GetScheduleByClassInput = z.infer<typeof getScheduleByClassInputSchema>;

// Response schemas
export const authResponseSchema = z.object({
  success: z.boolean(),
  user: userSchema.optional(),
  message: z.string().optional()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const dashboardStatsSchema = z.object({
  total_students: z.number(),
  total_teachers: z.number(),
  total_classes: z.number(),
  today_attendance_rate: z.number(),
  pending_leave_requests: z.number()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  loginInputSchema,
  createUserInputSchema,
  updateUserInputSchema,
  createStudentInputSchema,
  updateStudentInputSchema,
  createTeacherInputSchema,
  updateTeacherInputSchema,
  createClassInputSchema,
  updateClassInputSchema,
  createSubjectInputSchema,
  updateSubjectInputSchema,
  createScheduleInputSchema,
  updateScheduleInputSchema,
  checkInInputSchema,
  checkOutInputSchema,
  updateAttendanceInputSchema,
  createLeaveRequestInputSchema,
  processLeaveRequestInputSchema,
  getAttendanceByDateRangeInputSchema,
  getScheduleByClassInputSchema
} from './schema';

// Import handlers
import { login, logout, getCurrentUser } from './handlers/auth';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from './handlers/users';
import { 
  createStudent, 
  getStudents, 
  getStudentById, 
  getStudentsByClass, 
  updateStudent, 
  deleteStudent,
  getStudentAttendanceHistory 
} from './handlers/students';
import { 
  createTeacher, 
  getTeachers, 
  getTeacherById, 
  getTeachersBySubject, 
  updateTeacher, 
  deleteTeacher,
  getTeacherClasses,
  getTeacherSchedule 
} from './handlers/teachers';
import { 
  createClass, 
  getClasses, 
  getClassById, 
  getActiveClasses, 
  getClassesByGrade, 
  updateClass, 
  deleteClass,
  getClassStudentCount,
  getClassSchedule 
} from './handlers/classes';
import { 
  createSubject, 
  getSubjects, 
  getSubjectById, 
  getSubjectByCode, 
  updateSubject, 
  deleteSubject 
} from './handlers/subjects';
import { 
  createSchedule, 
  getSchedules, 
  getScheduleById, 
  getScheduleByClass, 
  getScheduleByTeacher, 
  getActiveSchedules, 
  updateSchedule, 
  deleteSchedule,
  checkScheduleConflicts,
  getTodaySchedules 
} from './handlers/schedules';
import { 
  checkIn, 
  checkOut, 
  getAttendanceByDateRange, 
  getTodayAttendance, 
  getStudentAttendance, 
  getAttendanceById, 
  updateAttendance,
  markAbsentStudents,
  getAttendanceStats,
  getClassAttendanceSummary 
} from './handlers/attendance';
import { 
  createLeaveRequest, 
  getLeaveRequests, 
  getPendingLeaveRequests, 
  getLeaveRequestById, 
  getStudentLeaveRequests, 
  getLeaveRequestsByClass, 
  processLeaveRequest, 
  deleteLeaveRequest,
  getLeaveRequestStats,
  getUpcomingLeaves 
} from './handlers/leave_requests';
import { 
  getDashboardStats,
  getStudentDashboard,
  getTeacherDashboard,
  getAdminDashboard 
} from './handlers/dashboard';
import { 
  generateAttendanceReport,
  generateClassReport,
  generateTeacherReport,
  generateStudentReport,
  generateMonthlyReport,
  exportReportToPDF,
  exportReportToExcel 
} from './handlers/reports';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    login: publicProcedure
      .input(loginInputSchema)
      .mutation(({ input }) => login(input)),
    logout: publicProcedure
      .mutation(() => logout()),
    getCurrentUser: publicProcedure
      .input(z.number())
      .query(({ input }) => getCurrentUser(input))
  }),

  // User management routes
  users: router({
    create: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => createUser(input)),
    getAll: publicProcedure
      .query(() => getUsers()),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getUserById(input)),
    update: publicProcedure
      .input(updateUserInputSchema)
      .mutation(({ input }) => updateUser(input)),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteUser(input))
  }),

  // Student management routes
  students: router({
    create: publicProcedure
      .input(createStudentInputSchema)
      .mutation(({ input }) => createStudent(input)),
    getAll: publicProcedure
      .query(() => getStudents()),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getStudentById(input)),
    getByClass: publicProcedure
      .input(z.number())
      .query(({ input }) => getStudentsByClass(input)),
    update: publicProcedure
      .input(updateStudentInputSchema)
      .mutation(({ input }) => updateStudent(input)),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteStudent(input)),
    getAttendanceHistory: publicProcedure
      .input(z.object({
        studentId: z.number(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date()
      }))
      .query(({ input }) => getStudentAttendanceHistory(input.studentId, input.startDate, input.endDate))
  }),

  // Teacher management routes
  teachers: router({
    create: publicProcedure
      .input(createTeacherInputSchema)
      .mutation(({ input }) => createTeacher(input)),
    getAll: publicProcedure
      .query(() => getTeachers()),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getTeacherById(input)),
    getBySubject: publicProcedure
      .input(z.string())
      .query(({ input }) => getTeachersBySubject(input)),
    update: publicProcedure
      .input(updateTeacherInputSchema)
      .mutation(({ input }) => updateTeacher(input)),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteTeacher(input)),
    getClasses: publicProcedure
      .input(z.number())
      .query(({ input }) => getTeacherClasses(input)),
    getSchedule: publicProcedure
      .input(z.object({
        teacherId: z.number(),
        dayOfWeek: z.number().optional()
      }))
      .query(({ input }) => getTeacherSchedule(input.teacherId, input.dayOfWeek))
  }),

  // Class management routes
  classes: router({
    create: publicProcedure
      .input(createClassInputSchema)
      .mutation(({ input }) => createClass(input)),
    getAll: publicProcedure
      .query(() => getClasses()),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getClassById(input)),
    getActive: publicProcedure
      .query(() => getActiveClasses()),
    getByGrade: publicProcedure
      .input(z.string())
      .query(({ input }) => getClassesByGrade(input)),
    update: publicProcedure
      .input(updateClassInputSchema)
      .mutation(({ input }) => updateClass(input)),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteClass(input)),
    getStudentCount: publicProcedure
      .input(z.number())
      .query(({ input }) => getClassStudentCount(input)),
    getSchedule: publicProcedure
      .input(z.object({
        classId: z.number(),
        dayOfWeek: z.number().optional()
      }))
      .query(({ input }) => getClassSchedule(input.classId, input.dayOfWeek))
  }),

  // Subject management routes
  subjects: router({
    create: publicProcedure
      .input(createSubjectInputSchema)
      .mutation(({ input }) => createSubject(input)),
    getAll: publicProcedure
      .query(() => getSubjects()),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getSubjectById(input)),
    getByCode: publicProcedure
      .input(z.string())
      .query(({ input }) => getSubjectByCode(input)),
    update: publicProcedure
      .input(updateSubjectInputSchema)
      .mutation(({ input }) => updateSubject(input)),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteSubject(input))
  }),

  // Schedule management routes
  schedules: router({
    create: publicProcedure
      .input(createScheduleInputSchema)
      .mutation(({ input }) => createSchedule(input)),
    getAll: publicProcedure
      .query(() => getSchedules()),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getScheduleById(input)),
    getByClass: publicProcedure
      .input(getScheduleByClassInputSchema)
      .query(({ input }) => getScheduleByClass(input)),
    getByTeacher: publicProcedure
      .input(z.object({
        teacherId: z.number(),
        dayOfWeek: z.number().optional()
      }))
      .query(({ input }) => getScheduleByTeacher(input.teacherId, input.dayOfWeek)),
    getActive: publicProcedure
      .query(() => getActiveSchedules()),
    update: publicProcedure
      .input(updateScheduleInputSchema)
      .mutation(({ input }) => updateSchedule(input)),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteSchedule(input)),
    checkConflicts: publicProcedure
      .input(z.union([createScheduleInputSchema, updateScheduleInputSchema]))
      .query(({ input }) => checkScheduleConflicts(input)),
    getToday: publicProcedure
      .query(() => getTodaySchedules())
  }),

  // Attendance management routes
  attendance: router({
    checkIn: publicProcedure
      .input(checkInInputSchema)
      .mutation(({ input }) => checkIn(input)),
    checkOut: publicProcedure
      .input(checkOutInputSchema)
      .mutation(({ input }) => checkOut(input)),
    getByDateRange: publicProcedure
      .input(getAttendanceByDateRangeInputSchema)
      .query(({ input }) => getAttendanceByDateRange(input)),
    getToday: publicProcedure
      .input(z.number().optional())
      .query(({ input }) => getTodayAttendance(input)),
    getByStudent: publicProcedure
      .input(z.object({
        studentId: z.number(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date()
      }))
      .query(({ input }) => getStudentAttendance(input.studentId, input.startDate, input.endDate)),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getAttendanceById(input)),
    update: publicProcedure
      .input(updateAttendanceInputSchema)
      .mutation(({ input }) => updateAttendance(input)),
    markAbsent: publicProcedure
      .input(z.object({
        scheduleId: z.number(),
        attendanceDate: z.coerce.date()
      }))
      .mutation(({ input }) => markAbsentStudents(input.scheduleId, input.attendanceDate)),
    getStats: publicProcedure
      .input(z.object({
        classId: z.number().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => getAttendanceStats(input.classId, input.startDate, input.endDate)),
    getClassSummary: publicProcedure
      .input(z.object({
        classId: z.number(),
        date: z.coerce.date()
      }))
      .query(({ input }) => getClassAttendanceSummary(input.classId, input.date))
  }),

  // Leave request routes
  leaveRequests: router({
    create: publicProcedure
      .input(createLeaveRequestInputSchema)
      .mutation(({ input }) => createLeaveRequest(input)),
    getAll: publicProcedure
      .query(() => getLeaveRequests()),
    getPending: publicProcedure
      .query(() => getPendingLeaveRequests()),
    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => getLeaveRequestById(input)),
    getByStudent: publicProcedure
      .input(z.number())
      .query(({ input }) => getStudentLeaveRequests(input)),
    getByClass: publicProcedure
      .input(z.number())
      .query(({ input }) => getLeaveRequestsByClass(input)),
    process: publicProcedure
      .input(processLeaveRequestInputSchema)
      .mutation(({ input }) => processLeaveRequest(input)),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => deleteLeaveRequest(input)),
    getStats: publicProcedure
      .input(z.object({
        studentId: z.number().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => getLeaveRequestStats(input.studentId, input.startDate, input.endDate)),
    getUpcoming: publicProcedure
      .input(z.object({
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => getUpcomingLeaves(input.startDate, input.endDate))
  }),

  // Dashboard routes
  dashboard: router({
    getStats: publicProcedure
      .query(() => getDashboardStats()),
    getStudent: publicProcedure
      .input(z.number())
      .query(({ input }) => getStudentDashboard(input)),
    getTeacher: publicProcedure
      .input(z.number())
      .query(({ input }) => getTeacherDashboard(input)),
    getAdmin: publicProcedure
      .query(() => getAdminDashboard())
  }),

  // Reports routes
  reports: router({
    generateAttendance: publicProcedure
      .input(z.object({
        classId: z.number().optional(),
        studentId: z.number().optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => generateAttendanceReport(input.classId, input.studentId, input.startDate, input.endDate)),
    generateClass: publicProcedure
      .input(z.object({
        classId: z.number(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => generateClassReport(input.classId, input.startDate, input.endDate)),
    generateTeacher: publicProcedure
      .input(z.object({
        teacherId: z.number(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => generateTeacherReport(input.teacherId, input.startDate, input.endDate)),
    generateStudent: publicProcedure
      .input(z.object({
        studentId: z.number(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional()
      }))
      .query(({ input }) => generateStudentReport(input.studentId, input.startDate, input.endDate)),
    generateMonthly: publicProcedure
      .input(z.object({
        month: z.number(),
        year: z.number()
      }))
      .query(({ input }) => generateMonthlyReport(input.month, input.year)),
    exportToPDF: publicProcedure
      .input(z.object({
        reportData: z.any(),
        reportType: z.string()
      }))
      .mutation(({ input }) => exportReportToPDF(input.reportData, input.reportType)),
    exportToExcel: publicProcedure
      .input(z.object({
        reportData: z.any(),
        reportType: z.string()
      }))
      .mutation(({ input }) => exportReportToExcel(input.reportData, input.reportType))
  })
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`🎓 Absensi Sekolah TRPC server listening at port: ${port}`);
}

start();
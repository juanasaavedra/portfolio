import { z } from 'zod';

export const availabilityQuerySchema = z.object({
  start: z.string().datetime().optional()
});

export const bookingSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  topic: z.string().min(2).max(120),
  notes: z.string().max(500).optional().or(z.literal('')),
  start: z.string().datetime()
});

export const enrollmentSchema = z.object({
  courseId: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email()
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;

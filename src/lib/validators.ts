import { z } from 'zod';

export const registrationSchema = z.object({
  fullName: z.string().min(3).max(120),
  gender: z.enum(['MALE', 'FEMALE']),
  age: z.coerce.number().int().min(5).max(100),
  country: z.string().min(2).max(60),
  city: z.string().min(2).max(60),
  phone: z.string().min(6).max(20),
  guardianName: z.string().max(120).optional().or(z.literal('')),
  guardianPhone: z.string().max(20).optional().or(z.literal('')),
  previousSchool: z.string().max(200).optional().or(z.literal('')),
  previousCity: z.string().max(60).optional().or(z.literal('')),
  previousTeacher: z.string().max(120).optional().or(z.literal('')),
  learningDuration: z.string().max(60).optional().or(z.literal('')),
  readingLevel: z.string().max(60).optional().or(z.literal('')),
  studiedTajweed: z.coerce.boolean().default(false),
  hasPreviousIjazah: z.coerce.boolean().default(false),
  studiedRiwayat: z.string().max(200).optional().or(z.literal('')),
  certificates: z.string().max(500).optional().or(z.literal('')),
  hasReadQuranByLooking: z.coerce.boolean().default(false),
  hasMemorizedQuran: z.coerce.boolean().default(false),
  memorizationAmount: z.string().max(60).optional().or(z.literal('')),
  programId: z.string().optional().or(z.literal('')),
  preferredTeacherId: z.string().optional().or(z.literal('')),
  preferredDays: z.string().max(60).optional().or(z.literal('')),
  preferredTimeSlots: z.string().max(60).optional().or(z.literal('')),
  additionalNotes: z.string().max(1000).optional().or(z.literal('')),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
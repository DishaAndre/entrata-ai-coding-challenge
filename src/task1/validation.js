import { z } from 'zod';

const urlSchemeRegex = /^https?:\/\/.+/;
const phoneWithCountryCodeRegex = /^\+?[1-9]\d{1,14}$/;

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name cannot exceed 50 characters'),

  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || phoneWithCountryCodeRegex.test(val.replace(/[\s-]/g, '')),
      'Enter a valid phone number with country code (e.g., +91 9876543210)'
    ),

  website: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => !val || urlSchemeRegex.test(val),
      'Enter a valid URL including http:// or https://'
    ),

  bio: z
    .string()
    .max(160, 'Bio length limit is 160 characters')
    .optional()
    .or(z.literal('')),
});
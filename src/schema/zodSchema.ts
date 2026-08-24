import { z, ZodType } from 'zod';

import { LoginUser, Users } from '../types';

const acceptedImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const postSchema = z.object({
  image: z
    .instanceof(File, {
      message: 'Image is required and must be of type .jpg, .jpeg, .png'
    })

    .refine(
      (file) => file && acceptedImage.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
  caption: z
    .string()

    .max(100, 'Caption can contain at most 100 characters! Please include details in description!'),
  description: z.string().max(200, 'The description cannot exceed 500 characters!')
});

export const postUpdateSchema = z.object({
  caption: z
    .string()

    .max(100, 'Caption can contain at most 100 characters! Please include details in description!'),
  description: z.string().max(200, 'The description cannot be exceed 500 characters!')
});
export const loginSchema: ZodType<LoginUser> = z.object({
  email: z
    .string()
    .min(1, { message: 'Fields cannot be empty' })
    .email({ message: 'Email not valid' }),
  password: z.string().min(6, { message: 'Password must be atleast 6 characters' }).max(15)
});

export const signupSchema: ZodType<Users> = z.object({
  username: z
    .string({ message: 'Username must be a string' })
    .min(3, { message: 'Username must contain atleast 4 characters' }),
  email: z
    .string()
    .min(1, { message: 'Fields cannot be empty' })
    .email({ message: 'Email not valid' }),
  password: z.string().min(6, { message: 'Password must be atleast 6 characters' }).max(15),
  firstName: z
    .string({ message: 'First name must be a string' })
    .min(3, { message: 'First name must contain atleast 4 characters' }),
  lastName: z
    .string({ message: 'Last name must be a string' })
    .min(2, { message: 'Last name must contain atleast 4 characters' })
});

export const userDetailsSchema = z.object({
  firstName: z.string().min(1, 'The firstname cannot be empty'),
  lastName: z.string().min(1, 'The lastname cannot be empty').max(20),
  about: z.string().max(100, 'About you in less than 100 characters please!')
});
export const userPhotoSchema = z.object({
  image: z
    .instanceof(File, { message: 'Image is required and must be a file' })
    .optional()
    .refine(
      (file) => file && acceptedImage.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
});

export type PostData = z.infer<typeof postSchema>;
export type userSchema = z.infer<typeof userDetailsSchema>;

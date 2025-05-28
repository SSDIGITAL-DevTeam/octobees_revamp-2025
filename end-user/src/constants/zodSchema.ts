import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email().nonempty(),
    dialCodes: z.string(),
    phoneNumber: z.string().nonempty().default("+62"),
    bussiness: z.string().nonempty(),
    message: z.string().nonempty(),
    date: z.date(),
    time: z.string().nonempty("Please select a time"),
});

export type ContactSchema = z.infer<typeof contactSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
];

export const careerSchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email().nonempty(),
    dialCodes: z.string().default("ID"),
    phoneNumber: z.string().nonempty(),
    position: z.string().nonempty(),
    portfolio: z.string().nonempty(),
    resume: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "File must be less than 2MB",
      })
      .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
        message: "Only PDF, DOC, or DOCX files are allowed",
      }),
    message : z.string().optional(),
});


export type CareerSchema = z.infer<typeof careerSchema>;

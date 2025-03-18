import { z } from "zod";
export const loginSchema = z.object({
    email: z
        .string({ required_error: "Email dibutuhkan" })
        .max(30, "Maksimal 30 Karakter")
        .email("Format Email tidak Valid"),
    password: z
        .string({ required_error: "Password dibutuhkan" })
        .min(8, "Minimal 8 Karakter")
        .max(20, "Maksimal 20 Karakter")
        .regex(
            /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_])/,
            "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol"
        ),
});

export const registerSchema = loginSchema.extend({
    confirmPassword: z
        .string({ required_error: "Konfirmasi password dibutuhkan" })
        .min(8, "Minimal 8 Karakter")
        .max(20, "Maksimal 20 Karakter")
        .regex(
            /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_])/,
            "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol"
        ),
    location: z
        .string({ required_error: "Lokasi dibutuhkan" })
        .min(3, "Minimal 3 Karakter")
        .max(30, "Maksimal 30 Karakter"),
    phoneNumber: z
        .string({
            invalid_type_error: "Nomor telepon harus berupa angka",
        })
        .min(8, { message: "Minimal 8 digit angka" })
        .max(20, { message: "Maksimal 20 digit angka" })
        .regex(
            /^(?:\+62|62|0)8[1-9]\d{6,14}$/,
            "Nomor Telepon tidak valid, gunakan format yang benar. (+62/62/0)"
        ),
    name: z
        .string({ required_error: "Nama dibutuhkan" })
        .min(3, "Minimal 3 Karakter")
        .max(30, "Maksimal 30 Karakter"),
    gender: z.enum(["laki-laki", "perempuan"], {
        required_error: "Jenis Kelamin dibutuhkan",
        message: "Jenis Kelamin tersebut tidak ada"
    }),
    birthDate: z
        .string({
            required_error: "Tanggal lahir dibutuhkan",
            invalid_type_error: "Tanggal Lahir harus berupa string",
        })
        .transform((str) => new Date(str)) // Konversi dari string ke Date
        .refine((date) => !isNaN(date.getTime()), {
            message: "Format tanggal tidak valid",
        })
        .refine((date) => date <= new Date(), {
            message: "Tanggal lahir harus di masa lalu",
        }),

})

export const userSchema = registerSchema.extend({
    role: z.enum(["user", "admin", "superadmin"], {
        required_error: "Role dibutuhkan",
        message: "Role tersebut tidak termasuk"
    }).optional(),
    numberKTP: z.string({
        invalid_type_error: "Nomor KTP harus berupa angka",
    })
        .length(16, { message: "Nomor KTP harus tepat 16 digit" })
        .regex(/^\d+$/, "Nomor KTP harus hanya terdiri dari angka"),
    numberKK: z
        .string({
            invalid_type_error: "Nomor KK harus berupa angka",
        })
        .length(16, { message: "Nomor KK harus tepat 16 digit" })
        .regex(/^\d+$/, "Nomor KK harus hanya terdiri dari angka"),
    numberBPJS: z
        .string({
            invalid_type_error: "Nomor BPJS harus berupa angka",
        })
        .length(13, { message: "Nomor BPJS harus tepat 13 digit" })
        .regex(/^\d+$/, "Nomor BPJS harus hanya terdiri dari angka"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sesuai",
    path: ["confirmPassword"],
});

export const adminSchema = registerSchema.extend({
    role: z.enum(["admin", "superadmin"], {
        required_error: "Role dibutuhkan",
        message: "Role tersebut tidak termasuk"
    }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sesuai",
    path: ["confirmPassword"],
});

const scheduleSchema = z.object({
    day: z.string({ message: "Itu Bukan Termasuk Hari" }).optional(),
    open: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Waktu mulai tidak valid")
        .optional(),
    close: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Waktu selesai tidak valid")
        .optional(),
    quota: z.preprocess((val) => Number(val), z.number(), { message: "Minimal 1" }).optional(),
    booked: z.preprocess((val) => Number(val), z.number(), { message: "Minimal 1" }).optional(),
})

export const doctorSchema = z.object({
    polyclinicId: z
        .preprocess((val) => Number(val), z
            .number()
            .positive(),
            { message: "Minimal 1" }),
    name: z
        .string({ required_error: "Nama dibutuhkan" })
        .min(3, "Minimal 3 Karakter")
        .max(100, "Maksimal 100 Karakter"),
    polyName: z
        .string({ required_error: "Nama Poli dibutuhkan" })
        .min(3, "Minimal 3 Karakter")
        .max(100, "Maksimal 100 Karakter"),
    gender: z.enum(["Wanita", "Pria", "wanita", "pria"], {
        required_error: "Gender dibutuhkan",
        message: "Gender tersebut Tidak Termasuk"
    }),
    email: z
        .string({ required_error: "Email dibutuhkan" })
        .max(30, "Maksimal 30 Karakter")
        .email("Format Email tidak Valid"),
    descriptions: z
        .string({ required_error: "Deskripsi dibutuhkan" })
        .min(3, "Minimal 3 Karakter")
        .max(200, "Maksimal 200 Karakter"),
    location: z
        .string({ required_error: "Asal domisili dibutuhkan" })
        .min(3, "Minimal 3 Karakter")
        .max(200, "Maksimal 200 Karakter"),
    schedules: z.array(scheduleSchema),
    availableDays: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Kamu harus mengisi minimal 1 hari",
    }),
});


export const bookingSchema = z.object({
    polyclinicId: z.preprocess((val) => Number(val), z.number().positive(), { message: "Minimal 1" }),
    doctorId: z.preprocess((val) => Number(val), z.number().positive(), { message: "Minimal 1" }),
    userId: z.string(),
    name: z
        .string({ required_error: "Nama dibutuhkan" })
        .min(3, "Minimal 3 Karakter")
        .max(30, "Maksimal 30 Karakter"),
    status: z.enum(["Waiting", "Approved", "Completed", "Canceled"], {
        required_error: "Status dibutuhkan",
        message: "Itu Bukan Termasuk Pilihan",
    }),
    queueNumber: z.preprocess((val) => Number(val), z.number().positive(), { message: "Minimal 1" }),
    scheduleDay: z.enum(["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"], {
        required_error: "Hari dibutuhkan",
        message: "Itu Bukan Termasuk Hari",
    }),
    bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Format Booking Keliru" }),
})

// export const putUserSchema = userSchema.partial();
// export const putDoctorSchema = doctorSchema.partial();
// export const putBookingSchema = bookingSchema.partial();
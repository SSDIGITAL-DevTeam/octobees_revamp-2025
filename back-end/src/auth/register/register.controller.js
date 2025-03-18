import express from 'express'
import { z } from 'zod';
import { createUser } from '../../user/user.service.js';
import dayjs from 'dayjs';
import { userSchema } from '../../../lib/zodSchema.js';

const router = express.Router()
//
router.post("/", async (req, res) => {
    try {
        const { name, email, password, confirmPassword, location, birthDate, gender, phoneNumber, numberKTP, numberKK, numberBPJS } = req.body;

        if (!name
            || !email
            || !password
            || !confirmPassword
            || !location
            || !phoneNumber
            || !birthDate
            || !gender
            || !numberKTP
            || !numberKK
            || !numberBPJS
        ) {
            throw new Error("Data tidak lengkap");
        }

        const payload = userSchema.parse(req.body)

        const { confirmPassword: unused, ...newPayload } = payload;

        if (password !== confirmPassword) {
            throw new Error("Password tidak sesuai")
        }

        const isoDate = dayjs(birthDate).toISOString();

        await createUser({
            ...newPayload,
            birthDate: isoDate,
        });
        res.status(201).json({ message: "Registrasi Berhasil" });

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: `${error.errors[0].message} - pada kolom ${error.errors[0].path[0]}`,
            });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

export default router
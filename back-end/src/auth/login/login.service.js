import jwt from 'jsonwebtoken';
import { editUser, findUserByEmail } from '../../role/role.repository.js';
import { compare } from 'bcrypt'

export const loginUser = async (data) => {
    try {
        const { email, password: inputPassword } = data

        let validatedUser = await findUserByEmail(email)

        if (!validatedUser || validatedUser.length === 0) {
            throw new Error("Email tidak ditemukan")
        }
		
        const { password, id, name, role } = validatedUser

        const isPassword = await compare(inputPassword, password)
        if (!isPassword) {
            throw new Error("Password Salah")
        }

        const payload = { id, name, role, email }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30s"
        })
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "1d"
        })

        await editUser(id, { refreshToken })

        return { accessToken, refreshToken }

    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }
}
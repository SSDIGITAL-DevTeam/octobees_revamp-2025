import jwt from 'jsonwebtoken'

import { compare } from 'bcrypt'
import { editUser, findUserByEmail } from '../../user/user.repository.js'

export const loginUser = async (data) => {
    try {
        const { email, password: inputPassword } = data
        
        let validatedUser = await findUserByEmail(email)
        
        console.log("==========="+email)
        if (!validatedUser || validatedUser.length === 0) {
            throw new Error('Email not found')
        }

        const { password, id, name, role, features } = validatedUser
        // console.log(validatedUser)
        
        
        const payload = { id, name, role, email, features }
        // console.log(payload)
        const isPassword = await compare(inputPassword, password)
        if (!isPassword) {
            throw new Error('Password does not match')
        }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s',
        })
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d',
            }
        )

        await editUser(id, { refreshToken })

        return { accessToken, refreshToken }
    } catch (error) {
        //throw new Error("Tes")
        throw new Error(error.message)
    }
}

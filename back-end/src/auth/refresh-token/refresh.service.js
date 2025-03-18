import jwt from 'jsonwebtoken';
// import { findUserByRefreshToken } from '../../user/user.repository.js';

export const verifyRefreshToken = async (refreshToken) => {
    try {
        // let response = await findUserByRefreshToken(refreshToken);
        // if (!response) {
        //         throw new Error(401)
        //     }

        // return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        //     if (err) {
        //         throw new Error(403)
        //     }
        //     const { id, name, email, role } = response
        //     const accessToken = jwt.sign({ id, name, role, email }, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: "30s"
        //     })
        //     return accessToken
        // })
    } catch (error) {
        throw new Error(error.message)
    }
}
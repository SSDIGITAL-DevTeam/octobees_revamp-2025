import { editUser, findUserByRefreshToken } from "../../user/user.repository.js";

export const deleteRefreshToken = async (refreshToken) => {
    try {
        let response = await findUserByRefreshToken(refreshToken);
        if (!response) {
			throw new Error(204)
        }
        const { id } = response
        await editUser(id, { refreshToken: null })
        return true
    } catch (error) {
        throw new Error(error.message)
    }
}
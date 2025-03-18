import { editUser, findUserByRefreshToken } from "../../role/role.repository.js";

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
        console.log(error)
        throw new Error(error.message)
    }
}
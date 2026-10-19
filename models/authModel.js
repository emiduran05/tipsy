

const authModel = {
    login: async function (userData) {
        const { username} = userData;
            
        //database query

        return {user: "admin@admin", password: "password"}

    }
}

module.exports = authModel;
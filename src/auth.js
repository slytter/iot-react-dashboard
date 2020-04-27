module.exports = {
    getAuthToken: (userType) => {
        return localStorage.getItem(userType + '-token')
    },
    setAuthToken: (userType, token) => {
        localStorage.setItem(userType + '-token', JSON.stringify(token))
    },
    logOut: (userType) => {
        localStorage.clear(userType + '-token')
    },
    USER_TYPES: {
        CUSTOMER: 'customer',
        ADMIN: 'admin',
        SUPPLIER: 'supplier',
    }
    
}
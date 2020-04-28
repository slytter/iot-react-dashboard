module.exports = {
    getAuthToken: (userType) => {
        return JSON.parse(localStorage.getItem(userType + '-token'))
    },
    setAuthToken: (userType, userObj) => {
        localStorage.setItem(userType + '-token', JSON.stringify(userObj))
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
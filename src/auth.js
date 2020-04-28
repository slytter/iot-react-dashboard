module.exports = {
    getAuthToken: (userType) => {
        return JSON.parse(localStorage.getItem(userType + '-token'))
    },
    setAuthToken: (userType, userObj) => {
        localStorage.setItem(userType + '-token', JSON.stringify(userObj))
    },
    logOut: (userType) => {
        console.log('logging out '+ userType)
        localStorage.removeItem(userType + '-token')
       // localStorage.setItem(userType + '-token', '')
    },
    USER_TYPES: {
        CUSTOMER: 'customer',
        ADMIN: 'admin',
        SUPPLIER: 'supplier',
    }
    
}
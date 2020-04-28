import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Button} from '@material-ui/core'
import auth from '../auth'

export default class Logout extends Component {
    static propTypes = {
        onLogout: PropTypes.func,
        tokenType: PropTypes.oneOf([auth.USER_TYPES.CUSTOMER, auth.USER_TYPES.ADMIN, auth.USER_TYPES.SUPPLIER]),
    }

    logOut = () => {
        auth.logOut(this.props.tokenType)
        this.props.onLogout()
    }

    render() {
        return (
            <Button color="primary" variant="contained" onClick={this.logOut}>Log out</Button>
        )
    }
}

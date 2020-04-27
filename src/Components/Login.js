import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TextField, Grid, Button } from '@material-ui/core'
import auth from '../auth'
import CircularProgress from '@material-ui/core/CircularProgress'

export default class Login extends Component {

    static propTypes = {
        onLogin: PropTypes.func,
        tokenType: PropTypes.oneOf([auth.USER_TYPES.CUSTOMER, auth.USER_TYPES.ADMIN, auth.USER_TYPES.SUPPLIER]),
    }

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
            loading: false,
        }
    }

    login = () => {
        this.setState({loading: true})
        if(this.state.email && this.state.password || true){
            fetch('https://smart-meter-app-iot.herokuapp.com/user-interface/login', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email || 'niec@itu.dk',
                    password: this.state.password || 'heltsikkert12',
                    signAs: this.props.tokenType,
                })
            }).then((response) => response.json())
            .then((response) => {
                this.setState({loading: false})
                if(response && response.token) {
                    const userType = auth.USER_TYPES[this.props.tokenType]
                    console.log({userType: this.props.tokenType})
                    auth.setAuthToken(this.props.tokenType, response)
                    this.props.onLogin()
                } else {
                    this.setState({errorMessage: response.message})

                }
                
                console.log({response})
            }).catch(err => {
                this.setState({loading: false})
                
                console.log({err})
            })
        } else {
            this.setState({errorMessage: 'Please enter email & password'})
        }

    }

    render() {
        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <TextField
                            name="email"
                            id="outlined-helperText"
                            label="Email"
                            defaultValue="someone@something.com"
                            helperText="Input email"
                            variant="outlined"
                            value={this.state.email}
                            onChange={(event) => this.setState({email: event.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            name="password"
                            id="outlined-helperText"
                            label="Password"
                            helperText="Input password"
                            variant="outlined"
                            value={this.state.password}
                            onChange={(event) => this.setState({password: event.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button startIcon={this.state.loading && <CircularProgress size={20} color="secondary" />} onClick={this.login} size="large" elevation={11} variant="contained" color="primary">Login</Button>
                    </Grid>
                    <Grid item xs={12}>
                        {this.state.errorMessage}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

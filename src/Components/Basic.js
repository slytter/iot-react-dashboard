import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Drawer from './Drawer'
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import Chart from './Chart'
import moment from 'moment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Select, Grid } from '@material-ui/core';
import Login from './Login';
import auth from '../auth';
import Logout from './Logout';

const Root = styled.div`
    
`

const Header = styled.div`
	
`

const getUsers = async () => {
	let response = await fetch (
		`https://smart-meter-app-iot.herokuapp.com/admin/return-users/
		?secret_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Im5pZWNAaXR1LmRrIn0sImlhdCI6MTU4ODAxMDg2MX0.g_W0e2sYJRYxcSeaLLY8sIPz0CkIzVPh9BKIrGIeRJs&fbclid=IwAR2EcWqFKUDuym3TF5QL7SQCWa_odNYOsy1G7YaJ8V8ui5cmXKi3B8G1ASU`
	)

	let data = await response.json()
	console.log(data.result)
	return data.result
}


class Basic extends Component {

	constructor(props){
		super(props)
		this.state = {
			users: [],
			chosenUser: null,
			loggedInAsAdmin: false,
		}

		getUsers().then((users) => {
			this.setState({users})
		})

	}

	componentDidMount() {
		getUsers()
		console.log({adminAuth: auth.getAuthToken(auth.USER_TYPES.ADMIN)})
	}

	updateThis = () => {
		this.forceUpdate()
	}

	render() {
		
		return (
			<Root>
				<Router>
					<Drawer>
						<Switch>
							<Route path="/customer">
								<h1>
									customer
								</h1>
							</Route>
							<Route path="/admin">
								<h1>
									admin
								</h1>
								{auth.getAuthToken(auth.USER_TYPES.ADMIN)
									? <Grid container spacing={2}>
										<Grid item sm={12}>
											{auth.getAuthToken(auth.USER_TYPES.ADMIN)}
										
											<Logout tokenType={auth.USER_TYPES.ADMIN} onLogout={this.updateThis}/>
										</Grid>
										<Grid item sm={12}>
											<FormControl variant="outlined">
												<InputLabel id="demo-simple-select-outlined-label">User</InputLabel>
												<Select
												value={this.state.chosenUser}
												onChange={(event) => this.setState({chosenUser: event.target.value})}
												label="User"
												>
												{
													this.state.users.map((user) => <MenuItem key={user.id} value={user.id}>{user.meterId + ': ' + user.firstName + ' ' + user.lastName}</MenuItem>)
												}
												</Select>
											</FormControl>
											<Chart 
												id={this.state.chosenUser}
												fromDate={moment().subtract(7, 'days')}
												toDate={moment()}
											/>
										</Grid>
									</Grid>
									: <Login tokenType={auth.USER_TYPES.ADMIN} onLogin={this.updateThis} />
								}

							</Route>
							<Route path="/supplier">
								supplier
							</Route>
							<Route path="/settings">
								settings
							</Route>
							<Route path="/">
								welcome
							</Route>
						</Switch>
					</Drawer>
				</Router>
			</Root>
		)
	}
}

Basic.propTypes = {}

export default Basic


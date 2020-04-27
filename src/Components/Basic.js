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
import Select from '@material-ui/core/Select';

const Root = styled.div`
    
`

const Header = styled.div`
	
`



class Basic extends Component {

	constructor(props){
		super(props)
		this.state = {
			users: [0,1,2,3],
			chosenUser: 0,
		}
	}

	componentDidMount(){
		
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
								<FormControl variant="outlined" >
									<InputLabel id="demo-simple-select-outlined-label">User</InputLabel>
									<Select
									value={this.state.chosenUser}
									onChange={(event) => this.setState({chosenUser: event.target.value})}
									label="User"
									>
									{
										this.state.users.map((user) => <MenuItem key={user} value={user}>User {user}</MenuItem>)
									}
									</Select>
								</FormControl>
								<Chart 
									id={this.state.chosenUser}
									fromDate={moment().subtract(7, 'days')}
									toDate={moment()}
								/>
							</Route>
							<Route path="/admin">
								admin
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


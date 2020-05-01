import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Drawer from './Drawer'
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import Login from './Login';
import auth from '../auth';
import Admin from './Admin';
import Customer from './Customer';
import { Select, Grid, Card, CardContent } from '@material-ui/core'
import Supplier from './Supplier';

const Root = styled.div`
    
`

const Header = styled.div`
	
`

const A = styled.a`
	text-decoration: underline;
	transition: 0.2s ease-out;
	opacity: 1;
	:hover{
		opacity: 0.5;
	}
`


class Basic extends Component {

	constructor(props){
		super(props)
		this.state = {
			users: [],
			chosenUser: null,
			adminLogin: null,
		}
	}

	componentDidMount() {
		this.setState({adminLogin: auth.getAuthToken(auth.USER_TYPES.ADMIN)})
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
									{auth.getAuthToken(auth.USER_TYPES.CUSTOMER)
										? <Customer onLogout={this.updateThis} />
										:	<> 
											<h1>
												Login as Customer
											</h1>
											<Login tokenType={auth.USER_TYPES.CUSTOMER} onLogin={this.updateThis} />
										</>
									}
								</Route>
								<Route path="/admin">
									{auth.getAuthToken(auth.USER_TYPES.ADMIN)
										? <Admin onLogout={this.updateThis} />
										:	<> 
											<h1>
												Login as Administrator
											</h1>
											<Login tokenType={auth.USER_TYPES.ADMIN} onLogin={this.updateThis} />
										</>
									}
								</Route>
								<Route path="/supplier">
									{auth.getAuthToken(auth.USER_TYPES.SUPPLIER)
										? <Supplier onLogout={this.updateThis} />
										: <Login tokenType={auth.USER_TYPES.SUPPLIER} onLogin={this.updateThis} />
									}
								</Route>
								<Route path="/settings">
									settings
								</Route>
								<Route path="/">
								<Card>
									<CardContent>
										<Grid container>
											<Grid item sm={6} xs={12}>
												<h1>IoT Excerise 2 Dashboard</h1>
												<A target="_blank" href="https://github.com/neheren/iot-react-dashboard">Front-end repository</A>
												<br/>
												<A target="_blank" href="https://github.com/klem95/smart_meter_app_iot">Back-end repository</A>
												<h2>Implemented by:</h2>
												<ul>
													<li>Anton Sandberg</li>
													<li>Nikolaj Schlüter</li>
													<li>Sune Klem</li>
												</ul>
											</Grid>
											<Grid item sm={6} xs={12}>
												<h1>Credentials</h1>
												<h2>Customer credentials</h2>
												<ul>
													<li>
														Anton Sandberg
														<ul>
															<li>
																Email: <b>anos@itu.dk</b>
															</li>
															<li>
																Password: <b>12345</b>
															</li>
														</ul>
													</li>
													<li>
														Sune Klem
														<ul>
															<li>
																Email: <b>sukl@itu.dk</b>
															</li>
															<li>
																Password: <b>qwert</b>
															</li>
														</ul>
													</li>
													<li>
														Nikolaj Schlüter
														<ul>
															<li>
																Email: <b>nsni@itu.dk</b>
															</li>
															<li>
																Password: <b>98765</b>
															</li>
														</ul>
													</li>
													<li>
														John Wick
														<ul>
															<li>
																Email: <b>jowi@itu.dk</b>
															</li>
															<li>
																Password: <b>asdfg</b>
															</li>
														</ul>
													</li>
												</ul>
												<h2>Admin credentials</h2>
												<ul>
													<li>
														Niels Chemnitz
														<ul>
															<li>
																Email: <b>niec@itu.dk</b>
															</li>
															<li>
																Password: <b>heltsikkert12</b>
															</li>
														</ul>
													</li>
												</ul>
												<h2>Electricity supplier credentials</h2>
												<ul>
													<li>
														Sebastian Büttrich
														<ul>
															<li>
																Email: <b>sbut@itu.dk</b>
															</li>
															<li>
																Password: <b>detbliver12</b>
															</li>
														</ul>
													</li>
												</ul>
											</Grid>
										</Grid>

									</CardContent>
								</Card>

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


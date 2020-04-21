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

const Root = styled.div`
    
`

const Header = styled.div`
	
`

class Basic extends Component {
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
								<Chart></Chart>
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


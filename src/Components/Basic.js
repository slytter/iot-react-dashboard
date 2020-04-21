import React, {Component} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Drawer from './Drawer'
const Root = styled.div`
    
`

const Header = styled.div`
	
`

class Basic extends Component {
	render() {
		return (
			<Root>
				<Drawer>
					hey
				</Drawer>
			</Root>
		)
	}
}

Basic.propTypes = {}

export default Basic


import { ResponsiveLine } from '@nivo/line'
import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import PropTypes from 'prop-types'
import auth from '../auth'

const baseData = [{
	"id": "loading",
	"color": "#3f51b5",
	"data": [
		{
			"x": 'Loading',
			"y": '...'
		},

	]
}]

const Root = styled.div`
	height: 500px;
`

const hourFormat = 'YYYY-MM-DD:HH:00'
const dayFormat = 'YYYY-MM-DD'

const tranformData = (data) => {
	const tranformation = data.result.smartMeterSamples.map((dataPoint, i) => {
		return {
			x: (moment(dataPoint.date).format(hourFormat)),
			y: dataPoint.wattsPerHour,
		}
	})
	return tranformation
}


export default class Chart extends Component {
	static propTypes = {
		id: PropTypes.number,
		fromDate: PropTypes.any,
		toDate: PropTypes.any,
		token: PropTypes.string,
		type: PropTypes.oneOf([auth.USER_TYPES.CUSTOMER, auth.USER_TYPES.ADMIN, auth.USER_TYPES.SUPPLIER]),
	}

	constructor(props){
		super(props)
		this.state = {
			data: null,
		}
	}

	getAdminData = async (id, from, to) => {
		let response = await fetch (
			`https://smart-meter-app-iot.herokuapp.com/admin/return-samples/${id}?startDate=${from.format(dayFormat)}&endDate=${to.format(dayFormat)}
			&secret_token=${this.props.token}`
		);
		let data = await response.json()
		return data;
	}

	getCostumerData = async (id, from, to) => {
		let response = await fetch (
			`https://smart-meter-app-iot.herokuapp.com/customer/return-samples
			?startDate=${from.format(dayFormat)}&endDate=${to.format(dayFormat)}
			&secret_token=${this.props.token}`
		);
		let data = await response.json()
		return data;
	}
	
	componentDidUpdate(prevProps) {
		if(
			(prevProps.id != this.props.id && this.props.id != -1) 
			|| moment(prevProps.fromDate).format(dayFormat) != moment(this.props.fromDate).format(dayFormat)
			|| moment(prevProps.toDate).format(dayFormat) != moment(this.props.toDate).format(dayFormat)
		)
		{
			this.updateStateWithData()
		}
	}

	updateStateWithData() {
		const dataType = ({
			[auth.USER_TYPES.CUSTOMER]: this.getCostumerData,
			[auth.USER_TYPES.ADMIN]: this.getAdminData, 
			[auth.USER_TYPES.SUPPLIER]: null
		})[this.props.type]

		dataType(this.props.id, this.props.fromDate, this.props.toDate).then((data) => {
			this.setState({
				data: [{
					"id": "User",
					"color": "hsl(136, 70%, 50%)",
					data: tranformData(data),
				}]
			})
		})

	}

	
	
	componentDidMount() {
		this.updateStateWithData()
	}

	

	render() {
		if(!this.state.data){
			return null
		}
		return <Root>
		<ResponsiveLine
			data={this.state.data || baseData}
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
			xScale={{ type: 'point' }}
			yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
			axisTop={null}
			axisRight={null}
			motionStiffness={170}
			axisBottom={{
				orient: 'bottom',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'Time interval',
				legendOffset: 36,
				legendPosition: 'middle',
				format: value => {
					return moment(value, hourFormat).format('HH') === '00' ? moment(value).format(dayFormat) : ''
				}
			}}
			axisLeft={{
				orient: 'left',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'count',
				legendOffset: -40,
				legendPosition: 'middle'
			}}
			colors={{ scheme: 'nivo' }}
			pointSize={10}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={2}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel="y"
			pointLabelYOffset={-12}
			useMesh={true}
			legends={[
				{
					anchor: 'bottom-right',
					direction: 'column',
					justify: false,
					translateX: 100,
					translateY: 0,
					itemsSpacing: 0,
					itemDirection: 'left-to-right',
					itemWidth: 80,
					itemHeight: 20,
					itemOpacity: 0.75,
					symbolSize: 12,
					symbolShape: 'circle',
					symbolBorderColor: 'rgba(0, 0, 0, .5)',
					effects: [
						{
							on: 'hover',
							style: {
								itemBackground: 'rgba(0, 0, 0, .03)',
								itemOpacity: 1
							}
						}
					]
				}
			]}
		/>
	</Root>

	}
}
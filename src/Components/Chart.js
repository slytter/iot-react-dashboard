import { ResponsiveLine } from '@nivo/line'
import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import PropTypes from 'prop-types'

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

const generateDates = (from, to) => {
    var dateArray = [];
    var currentDate = moment(from);
    var stopDate = moment(to);
    while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format(hourFormat))
        currentDate = moment(currentDate).add(1, 'hour');
	}
    return dateArray;

}


const getData = async (id, from, to) => {
	let response = await fetch (
		`https://smart-meter-app-iot.herokuapp.com/admin/return-samples/${id}
		?startDate=${moment().subtract(7, 'days').format('YYYY-MM-DD')}&endDate=${moment().format('YYYY-MM-DD')}
		&secret_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Im5pZWNAaXR1LmRrIn0sImlhdCI6MTU4ODAxMDg2MX0.g_W0e2sYJRYxcSeaLLY8sIPz0CkIzVPh9BKIrGIeRJs&fbclid=IwAR2EcWqFKUDuym3TF5QL7SQCWa_odNYOsy1G7YaJ8V8ui5cmXKi3B8G1ASU`
	);
	let data = await response.json()
	return data;
}

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
		fromDate: PropTypes.func,
		toDate: PropTypes.func,
	}

	constructor(props){
		super(props)
		this.state = {
			data: null,
		}
	}

	async componentDidUpdate(prevProps) {
		console.log(prevProps, this.props)
		if(prevProps.id != this.props.id && this.props.id != -1) {
			const data = await getData(this.props.id, this.props.fromDate, this.props.toDate)
			console.log({data})
			console.log(tranformData (data))
			console.log(generateDates(this.props.fromDate, this.props.toDate))
			this.setState({
				data: [{
					"id": "User",
					"color": "#3f51b5",
					data: tranformData(data),
				}]
			}, () => {
			})
			console.log(baseData, this.state.data)
	
		}
	}
	
	componentDidMount() {
		this.componentDidUpdate({prevProps:{id:-1}})
	}
	

	render() {
		return <Root>
		<h2>some chart</h2>
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
				tickRotation: 30,
				legend: 'transportation',
				legendOffset: 36,
				legendPosition: 'middle',
				format: value => {
					return moment(value, hourFormat).format('HH') === '00' ? moment(value).format('YYYY-MM-DD') : ''
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
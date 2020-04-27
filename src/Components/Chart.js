import { ResponsiveLine } from '@nivo/line'
import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import PropTypes from 'prop-types'

const baseData = [{
		"id": "loading",
		"color": "hsl(353, 70%, 50%)",
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

const generateDates = (from, to) => {
    var dateArray = [];
    var currentDate = moment(from);
    var stopDate = moment(to);
    while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('MM-DD/00:00') )
        currentDate = moment(currentDate).add(1, 'days');
		console.log(currentDate.format(), stopDate.format())
	}
    return dateArray;

}

const getData = async (id, from, to) => {

	let response = await fetch (
		`https://smart-meter-app-iot.herokuapp.com/admin/return-samples/${id}
		?startDate=${moment().subtract(7, 'days').format('YYYY-MM-DD')}&endDate=${moment().format('YYYY-MM-DD')}`
	);
	let data = await response.json()
	return data;
}

const tranformData = (data) => {
	const tranformation = data.result.smartMeterSamples.map((dataPoint, i) => {
		return {
			x: moment(dataPoint.date).format('MM-DD/HH:mm'),
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
		if(prevProps.id != this.props.id){
			const data = await getData(this.props.id)
			console.log({data})
			console.log(tranformData (data))
			this.setState({
				data: [{
					"id": "User",
					"color": "hsl(353, 70%, 50%)",
					data: tranformData(data),
				}]
			}, () => {
			})
			console.log(baseData, this.state.data)
	
		}
		
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
				tickRotation: 45,
				legend: 'transportation',
				legendOffset: 36,
				legendPosition: 'middle',
				tickValues: generateDates(this.props.fromDate, this.props.toDate),
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
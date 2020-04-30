import { ResponsiveLine } from '@nivo/line'
import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import PropTypes from 'prop-types'
import _ from 'lodash'
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
		customers: PropTypes.array,
		type: PropTypes.oneOf([auth.USER_TYPES.CUSTOMER, auth.USER_TYPES.ADMIN, auth.USER_TYPES.SUPPLIER]),
		predict: PropTypes.bool,
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

	getSupplierData = async (id, from, to) => {
		let response = await fetch (
			`https://smart-meter-app-iot.herokuapp.com/supplier/return-samples/${id}
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
			|| prevProps.predict != this.props.predict
		)
		{
			this.updateStateWithData().then(() => {
			})
		}
	}

	getCostumerFromMeterId = (id) => {
		const customer = _.filter(this.props.customers, cust => cust.meterId === id)
		if(customer.length > 0) { 
			return id + ': ' + customer[0].firstName
		} else { 
			return id
		}
	}

	async updateStateWithData () {
		const { id } = this.props
		if(this.props.type === auth.USER_TYPES.SUPPLIER) {
			const datas = []
			const predictions = []
			for (let i = 0; i < id.length; i++) {
				let supplierData = await this.getSupplierData(id[i], this.props.fromDate, this.props.toDate)
				supplierData = tranformData(supplierData)
				if(this.props.predict) {
					try{
						let prediction = await this.predict(id[i])
						let [newSupplierData, newPrediction] = this.mapPredictionWithData(supplierData, prediction)
						console.log(newSupplierData, newPrediction)
						datas.push(newSupplierData)
						datas.push(newPrediction)
					} catch(e) {
						alert(('Could not predict: ' + (e && e.error) || e ) || 'Unknown prediction error')
					}
				}else{
					datas.push(supplierData)
				}
				//console.log({prediction})
			}

			this.setState({
				data: _.map(datas, (data, i) => ({
					"id": this.getCostumerFromMeterId(id[i] || 'Prediction ' + i),
					"color": "hsl(136, 70%, 50%)",
					data: (data),
				}))
			}, () => {
				//console.log({dat: this.state.data})
			})
		} else {
			const dataType = ({
				[auth.USER_TYPES.CUSTOMER]: this.getCostumerData,
				[auth.USER_TYPES.ADMIN]: this.getAdminData, 
			})[this.props.type]
	
			dataType(this.props.id, this.props.fromDate, this.props.toDate).then((data) => {
				this.setState({
					data: [{
						"id": "User " + id,
						"color": "hsl(10, 70%, 50%)",
						data: tranformData(data),
					}]
				})
			})
		}
	}


	mapPredictionWithData = (realData, prediction) => {
		const lastDate = realData[realData.length - 1].x
		const nextDate = moment(lastDate, hourFormat).add(1, 'h').format(hourFormat)
		// copy realData:
		let predictionsRes = [...realData]
		let realDataRes = [...realData]
		// null all element but the last:
		predictionsRes = _.map(predictionsRes, (prediction, i) => ({x: i > predictionsRes.length - 2 ? prediction.x : null, y: prediction.y}))
		// Add last entry
		predictionsRes.push({x: nextDate, y: Math.round(prediction)})
		realDataRes.push({x: nextDate, y: null})
		console.log({predictionsRes})
		return [realDataRes, predictionsRes]
	}

	
	componentDidMount() {
		this.updateStateWithData()
	}

	predict = async (id) => {
		let response = await fetch (
			`https://smart-meter-app-iot.herokuapp.com/supplier/predict/${id}
			?secret_token=${this.props.token}`
		);
		if(response.status != 200) {
			throw new Error(await response.json())
		}

		let data = await response.json()
		return data.prediction;
		// next_day_timestamps
    }


	

	render() {

		return <Root>
		<ResponsiveLine
			data={this.state.data || baseData}
			margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
			xScale={{ type: 'point' }}
			// yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
			axisTop={null}
			axisRight={null}
			motionStiffness={170}
			axisBottom={{
				orient: 'bottom',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: `${moment(this.props.fromDate).format('ddd Do')} - ${moment(this.props.toDate).format('ddd Do')}`,
				legendOffset: 36,
				legendPosition: 'middle',
				format: value => {
					return moment(value, hourFormat).format('HH') === '00' ? moment(value).format('dddd, Do') : ''
				}
			}}
			axisLeft={{
				orient: 'left',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'Watt',
				legendOffset: -40,
				legendPosition: 'middle'
			}}
			colors={{ scheme: 'nivo' }}
			pointSize={3}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={3}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel="y"
			enableGridX={false}
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
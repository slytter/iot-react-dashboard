import React, { Component } from 'react'
import PropTypes from 'prop-types'
import auth from '../auth'



export default class PredictionControl extends Component {
    static propTypes = {
        prop: PropTypes,
        
    }

    constructor(props) {
        super(props)
        
        this.state = {
            login: auth.getAuthToken(auth.USER_TYPES.SUPPLIER),
        }
    }

	predict = async (id) => {
		let response = await fetch (
			`https://smart-meter-app-iot.herokuapp.com/supplier/predict/${id}
			?secret_token=${this.state.login.token}`
		);
		let data = await response.json()
		console.log({combined_avg_Wh: data.predictions.combined_avg_Wh})
		return data;
    }
    
    trainModel = () => {
        
    }

    componentWillMount() {
        // this.predict(1).then(res => {
        //     console.log({res})
        // })
    }

    render() {
        return (
            <div>
                Prediction control
            </div>
        )
    }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash';
import Chart from './Chart'
import moment from 'moment'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import { Select, Grid, Card, CardContent } from '@material-ui/core'
import Logout from './Logout'
import auth from '../auth'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PersonIcon from '@material-ui/icons/Person'
import Avatar from '@material-ui/core/Avatar'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import DatePicker from '../DatePicker'



export default class Customer extends Component {
    static propTypes = {
        onLogout: PropTypes.func,
    }

	constructor(props){
		super(props)
		this.state = {
			chosenUser: null,
            login: auth.getAuthToken(auth.USER_TYPES.CUSTOMER),
            fromDate: moment().subtract(7, 'days'),
            toDate: moment(),
		}
        console.log(auth.getAuthToken(auth.USER_TYPES.CUSTOMER))
    }
    
    
    getUsers = async () => {
        let response = await fetch (
            `https://smart-meter-app-iot.herokuapp.com/admin/return-users?secret_token=${this.state.login.token}`
        )

        let data = await response.json()

        for (let i = 0; i < data.result.length; i++) {
           data.result[i].avgWh = await this.getAverageWh(data.result[i].id)
        }
        
        return data.result
    }

    getAverageWh = async (userId) => {
        try{
            console.log('FETCH')
            let response = await fetch (
                `https://smart-meter-app-iot.herokuapp.com/admin/avg-wh/${userId}?secret_token=${this.state.login.token}`
            )
            let data = await response.json()
            console.log('DID FETCH')
            console.log({data})
            return data.result
        } catch(e) { 
            return e
        }
    } 

    render() {
        const { login, users, chosenUser } = this.state
        const { user } = login
        const chosenUserObejct = _.filter(users, user => chosenUser == user.id)[0]
        return login && (
            <div>
                <Grid container spacing={2}>
                    <Grid item sm={12} >
                        <Card elevation={2}>
                            <CardContent>
                                <Grid container>
                                    <Grid item sm={12} md={6} >
                                        <h2>
                                            Welcome, {login.user.firstName + ' ' + login.user.lastName}
                                        </h2>
                                        <Typography color="textSecondary">
                                            Email: <b>{login.user.email}</b>
                                        </Typography>
                                        <br/>
                                        <Logout tokenType={auth.USER_TYPES.CUSTOMER} onLogout={this.props.onLogout}/>
                                    </Grid>
                                    <Grid item sm={12} md={6} style={{paddingTop: 0}} >

                                        <List style={{
                                                width: '100%',
                                                overflowY: "auto",
                                                maxHeight: 500,
                                                paddingTop: '0 !important',
                                            }}>

                                            <List>

                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <PersonIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={user.firstName + ' ' + user.lastName} secondary={"Average wh: " + user.avgWh} />
                                                </ListItem>
                                                <ListItem>
                                                    <Typography color="textSecondary">
                                                        Meter id: <b>{user.meterId}</b>
                                                    </Typography>
                                                </ListItem>
                                                <ListItem>
                                                    <Typography color="textSecondary">
                                                        Email: <b>{user.email}</b>
                                                    </Typography>
                                                </ListItem>
                                                <ListItem>
                                                    <Typography color="textSecondary">
                                                        Address: <b>{user.address}</b>
                                                    </Typography>
                                                </ListItem>
                                            </List>
                                        </List>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item sm={12} >
                        <Card elevation={2}>
                            <CardContent >
                                <h2>Your power usage</h2>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <DatePicker  label="From date"
                                            selectedDate={this.state.fromDate}
                                            handleDateChange={date => this.setState({fromDate: moment(date)})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <DatePicker label="To date"
                                                selectedDate={this.state.toDate}
                                                handleDateChange={date => this.setState({toDate: moment(date)})}
                                            />
                                    </Grid>
                                </Grid>
                                {
                                    <Chart 
                                        type={auth.USER_TYPES.CUSTOMER}
                                        token={'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6Im5pZWNAaXR1LmRrIn0sImlhdCI6MTU4ODA4MjU3N30.0px-0DAJefhsXIWkpsPpQioaOolRV0-qnk6jBZod99g'}
                                        id={user.meterId}
                                        fromDate={this.state.fromDate}
                                        toDate={this.state.toDate}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

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
            spending: {
                avg: '- ',
                total: '- ',
            },
            fromDate: moment().subtract(7, 'days'),
            toDate: moment(),
		}
    }
    
    
    getAverageWh = async (userId) => {
        try{
            let response = await fetch (
                `https://smart-meter-app-iot.herokuapp.com/customer/avg-spending?secret_token=${
                    this.state.login.token
                }&startDate=${
                    moment().startOf('month').format('YYYY-MM-DD')
                }&endDate=${
                    moment().format('YYYY-MM-DD')
                }`
            )
            let data = await response.json()
            return data.result
        } catch(e) { 
            return e
        }
    } 

    componentDidMount() {
        this.getAverageWh(this.state.login.user.id).then((spending) =>{
            this.setState({spending: {
                avg: Math.round(spending.avgKWh * 10) / 10,
                total: Math.round(spending.totalSpending * 10) / 10,
            }})
        })
    }

    render() {
        const { login } = this.state
        const { user } = login
        console.log({user})
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
                                                    <ListItemText primary={user.firstName + ' ' + user.lastName} secondary={`Monthly average wattage: ${this.state.spending.avg}kW`} />
                                                    
                                                </ListItem>
                                                <ListItem>
                                                    <Typography color="textSecondary">
                                                        This months spending: <b>{this.state.spending.total}kr</b>
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
                                        token={login.token}
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

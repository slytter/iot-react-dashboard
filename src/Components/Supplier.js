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
import Checkbox from '@material-ui/core/Checkbox';
import UserThump from './UserThump';



export default class Supplier extends Component {
    static propTypes = {
        onLogout: PropTypes.func,
    }

	constructor(props){
		super(props)
		this.state = {
			customers: [],
			admins: [],
			chosenUser: null,
            login: auth.getAuthToken(auth.USER_TYPES.SUPPLIER),
            fromDate: moment().subtract(3, 'days'),
            toDate: moment(),
            displayDataForUsers: [1],
		}

    }
    
    
    getUsers = async () => {
        let response = await fetch (
            `https://smart-meter-app-iot.herokuapp.com/supplier?secret_token=${this.state.login.token}`
        )

        let data = await response.json()

        for (let i = 0; i < data.result.customers.length; i++) {
          const whData = await this.getAverageWh(data.result.customers[i].id)
          console.log({whData})
          data.result.customers[i].avgKWh = whData && Math.round(whData.avgKWh * 10) / 10
          data.result.customers[i].totalSpending = whData && Math.round(whData.totalSpending * 10) / 10
        }
        
        return data.result
    }

    getAverageWh = async (userId) => {
        try{
            let response = await fetch (
                `https://smart-meter-app-iot.herokuapp.com/supplier/avg-spending/${userId}?secret_token=${
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
            return 'could not get'
        }
    } 

	componentDidMount() {
        this.getUsers().then((data) => {
            this.setState({
                admins: data.admins,
                customers: data.customers,
            })
        })
    }

    returnCustomersFromAdmin = (adminId) => {
        return _.filter(this.state.customers, cust => 
            cust.adminId === adminId
        )
    }

    toggleUserDataDisplay = (userId) => {
        const { displayDataForUsers } = this.state
        const index = (_.findIndex(displayDataForUsers, id => id === userId))
        if(index !== -1) {
            _.remove(displayDataForUsers, i => i === userId)
        } else{
            displayDataForUsers.push(userId)
        }
        this.setState({displayDataForUsers: [...displayDataForUsers ]})
    }
    

    render() {
        const { login, users, chosenUser, admins } = this.state
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
                                        <Logout tokenType={auth.USER_TYPES.SUPPLIER} onLogout={this.props.onLogout}/>
                                    </Grid>
                                    <Grid item sm={12} md={6} >
                                        <List style={{
                                                width: '100%',
                                                overflowY: "auto", 
                                                maxHeight: 500,
                                            }}>
                                            <h3>
                                                List of administrators
                                            </h3>
                                            <p>Chosen users:</p>
                                            {
                                                this.state.displayDataForUsers.map(userId => 
                                                    <li>{userId}</li>
                                                )
                                            }
                                            {
                                                admins.map((admin) => 
                                                    <ExpansionPanel>
                                                        <ExpansionPanelSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1bh-content"
                                                            id="panel1bh-header"
                                                        >
                                                            <Typography><b>{`${admin.firstName} ${admin.lastName + ' '}`}</b></Typography>
                                                            <Typography>{`: Admin, id: ${admin.id}`}</Typography>
                                                        </ExpansionPanelSummary>
                                                        <ExpansionPanelDetails>
                                                            <List>
                                                                {console.log('rendering')}
                                                                {this.returnCustomersFromAdmin(admin.id).map((cust) => <>
                                                                    <UserThump user={cust} on>
                                                                        <Checkbox 
                                                                            checked={_.includes(this.state.displayDataForUsers, cust.id)} 
                                                                            onChange={() => this.toggleUserDataDisplay(cust.id)} />
                                                                    </UserThump>
                                                                </>
                                                                )}
                                                            </List>
                                                        </ExpansionPanelDetails>
                                                    </ExpansionPanel>
                                            
                                                )
                                            }
                                        </List>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item sm={12} >
                        <Card elevation={2}>
                            <CardContent >
                                <h2>Power usage of {chosenUserObejct && chosenUserObejct.firstName}</h2>
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
                                        type={auth.USER_TYPES.SUPPLIER}
                                        token={this.state.login.token}
                                        id={this.state.displayDataForUsers}
                                        fromDate={this.state.fromDate}
                                        toDate={this.state.toDate}
                                        customers={this.state.customers}
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

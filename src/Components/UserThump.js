import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PersonIcon from '@material-ui/icons/Person'
import Avatar from '@material-ui/core/Avatar'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography'
import { List, Grid } from '@material-ui/core'

export default class UserThump extends Component {
    static propTypes = {
        user: PropTypes.object,
    }

    handleChange = (event, isExpanded) => {
        this.setState({isExpanded});
    };

    constructor(props) {
        super(props)
        this.state = {
            isExpanded: false,
        }
    }

    render() {
        const { user } = this.props
        return (
            <ExpansionPanel fullWidth onChange={this.handleChange} expanded={this.state.isExpanded}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <ListItemAvatar>
                        {this.props.children || 
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        }
                    </ListItemAvatar>
                    <ListItemText primary={user.firstName + ' ' + user.lastName} secondary={`Monthly average wattage: ${user.avgKWh}kW`} />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <List>
                        <ListItem>
                            <Typography color="textSecondary">
                                This months spending: <b>{user.totalSpending}kr</b>
                            </Typography>
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
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

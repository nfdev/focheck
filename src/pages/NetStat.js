import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import "./index.css";
import NetStatTable from "./NetStatTable";
import NetStatChart from "./NetStatChart";
import Grid from '@material-ui/core/Grid';


const interval = 5000;
const maxlength = 1000 * 60 * 3 / interval;

const styles = theme => ({
  root: {
    overflowX: 'auto',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    margin: theme.spacing.unit * 1,
  },
});


class WShandler {

  constructor(clhandler){

    // Initialize
    this.msg = null;
    this.lastmsg = null;
    this.ws = new WebSocket('ws://' + window.location.host + '/ws');
    this.ws.onmessage = this.msghandler.bind(this);

    // Run client handler
    this.ch = setInterval(
      () => {
        if (this.ws.readyState === WebSocket.OPEN) {
          if (this.msg === this.lastmsg) {
            //wait
          } else {
            clhandler(this.msg);
          }
        }else if (this.ws.readState === WebSocket.CLOSED) {
          let dmsg = this.dummyMsg();
          clhandler(dmsg);
        } else {
          let dmsg = this.dummyMsg();
          clhandler(dmsg);
        }
      },
      interval);
  }

  msghandler(msg){
    this.lastmsg = this.msg;
    this.msg = msg;
  }

  dummyMsg(){
    const status = [
      "ESTABLISHED",
      "LISTEN",
      "CLOSE_WAIT",
    ];
    let conn = [];
    let n = Math.random()*100;
    for (let i = 0; i < n; i++) {
      conn.push(
        {
          id: i,
          status: status[parseInt(Math.random()*3)],
          laddr: '10.1.1.1',
          lport: '12345',
          raddr: '10.1.1.2',
          rport: '80',
        });
    }

    let data = {
      command: 'update',
      data: conn,
      timestamp: (new Date()).getTime() / 1000.0,
    };
    let msg = {
      data: JSON.stringify(data),
    };

    return msg;
  }
}

class NetStat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connections: [],
      history: [],
      ws: null,
    };
    this.chartRef = React.createRef();
  }

  handleMessage(msg) {
    let data = JSON.parse(msg.data);
    if (data.command === 'update') {
      data.timestamp = data.timestamp * 1000;

      this.setState({
        connections: data.data,
      });

      this.updateHistory(data.timestamp, data.data);
    }
  }

  updateHistory(timestamp, data){
    let history = this.state.history;
    while (history.length >= maxlength) {
      history.shift();
    };

    let stats = {};
    data.forEach(function (d) {
      if (stats[d.status]) {
        stats[d.status] += 1;
      }else{
        stats[d.status] = 1;
      }
    })

    history.push({
      timestamp: timestamp,
      stats: stats,
    });
    this.setState({
      history: history
    });
  }

  componentDidMount() {
    let ws = new WShandler(this.handleMessage.bind(this));
    this.setState({ws: ws});
  }

  componentDidUpdate() {
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      <Paper 
      className={classes.paper}
      elevation={20}
      >
      <Grid container spacing={24} alignItems='center'>
      <Grid item xs={6} ref={this.chartRef} >
      <NetStatChart history={this.state.history}/>
      </Grid>
      <Grid item xs={6}>
      <NetStatTable connections={this.state.connections}/>
      </Grid>
      </Grid>
      </Paper>
      </div>
    );
  }
}

NetStat.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(NetStat);

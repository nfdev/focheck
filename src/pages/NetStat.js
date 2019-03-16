import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import "./index.css";
import NetStatTable from "./NetStatTable";
import NetStatChart from "./NetStatChart";
import Grid from '@material-ui/core/Grid';


const sample_conn = [
  {
    id: 1,
    status: 'Establiched',
    laddr: '10.1.1.1',
    lport: '12345',
    raddr: '10.1.1.2',
    rport: '80',
  },
  {
    id: 2,
    status: 'Establiched',
    laddr: '172.1.1.1',
    lport: '23456',
    raddr: '172.1.1.1',
    rport: '8080',
  },
  {
    id: 3,
    status: 'Establiched',
    laddr: '192.168.1.1',
    lport: '34567',
    raddr: '192.168.1.1',
    rport: '443',
  },
];

const sample_clog= [
  { timestamp: '10:00:00', connections: 10},
  { timestamp: '10:00:01', connections: 10},
  { timestamp: '10:00:02', connections: 8},
  { timestamp: '10:00:03', connections: 20},
  { timestamp: '10:00:04', connections: 10},
  { timestamp: '10:00:05', connections: 30},
  { timestamp: '10:00:06', connections: 10},
];


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

function getTimestamp() {
  let date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  h = (h < 10) ? '0' + h : h;
  m = (m < 10) ? '0' + m : m;
  s = (s < 10) ? '0' + s : s;

  return(h + ':' + m + ':' + s);
}


class NetStat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      connections: [],
      //      history: [],
      history: sample_clog,
      ws: null,
    };
    this.chartRef = React.createRef();
  }


  updateHistory(data){
    let history = this.state.history;
    const maxlength = 60 * 30;
    if (history.length >= maxlength) {
      history = history.splice(history.length - maxlength - 1);
    };
    history.push({
      timestamp: data.timestamp,
      conn_stats: data.length
    });
    this.setState({
      history: history
    });
  }

  componentDidMount() {
    let ws = new WebSocket('ws://' + window.location.host + '/ws');
    ws.onmessage = this.handleMessage.bind(this);
    ws.onerror = function(e){
      console.log("WS Connections Failure, Dummy WS starts.");
      ws = setInterval(
        function(){
          let msg = {
            data: parseInt(Math.random() * 100),
            timestamp: getTimestamp(),
          };
          this.handleMessage(msg);
        }, 5);
    }
    this.setState({ws: ws});
  }

  componentDidUpdate() {
  }

  handleMessage(msg) {
    let data = JSON.parse(msg.data);
    if (data.command === 'update') {
      this.setState({
        connections: data.data,
      });
      this.updateHistory(data.data);
    }
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

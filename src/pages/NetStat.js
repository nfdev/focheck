import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';


const sample = [
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

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
  primsort: {
    backgroundColor: theme.palette.secondary.main
  },
});

const rows = [
  { id: 'id', label: 'id' },
  { id: 'status', label: 'status' },
  { id: 'laddr', label: 'laddr' },
  { id: 'lport', label: 'lport' },
  { id: 'raddr', label: 'raddr' },
  { id: 'rport', label: 'rport' },
];


class NetStat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: sample,
      sortflags: [
        {id: 'id', asc: true}
      ],
      ws: null,
    };
  }

  componentDidMount() {
    //let ws = new WebSocket('ws://' + location.host + '/ws');
    var ws = new WebSocket('ws://10.0.0.191:8000/ws');
    ws.onmessage = this.handleMessage.bind(this);
    this.setState({ws: ws});
  }

  handleMessage(msg) {
    let data = JSON.parse(msg.data);
    if (data.command = 'update') {
      this.setState({
        connections: data.data,
      });
      this.sortall();
    }
  }

  createSortHandler(id){
    let sortflags = [];
    let asc = true;
    for (let i = 0; i < this.state.sortflags.length; i++){
      if (this.state.sortflags[i].id == id) {
        asc = !this.state.sortflags[i].asc;
      }else{
        sortflags.push(this.state.sortflags[i]);
      }
    }
    sortflags.push({id: id, asc: asc});

    return(
      event => {
        this.setState(
          {sortflags: sortflags}
        );
        this.sortall();
      }
    )
  }

  sortall(){
    let connections = this.state.connections;
    for (let i = 0; i < this.state.sortflags.length; i++){
      let id = this.state.sortflags[i].id;
      let asc = this.state.sortflags[i].asc;

      if (asc) {
        connections.sort(function(a,b){
          if(a[id] < b[id]) return 1;
          if(b[id] < a[id]) return -1;
          return 0;
        });
      }else{ 
        connections.sort(function(a,b){
          if(b[id] < a[id]) return 1;
          if(a[id] < b[id]) return -1;
          return 0;
        });
      }
    }
    this.setState({
      connections: connections,
    });
  }

  render () {
    const { classes } = this.props;
    const connections = this.state.connections;

    const primid = 2;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow key={'conn-head'}>
              { rows.map(h => {
                return (
                  <TableCell
                    key={'conn-head-' + h.id}
                    sortDirection='asc'
                  >
                  <TableSortLabel
                    active={this.state.sortflags.slice(-1)[0].id == h.id ? true : false}
                    onClick={this.createSortHandler(h.id)}
                  />
                  {h.label}
                  </TableCell>
                )})
              }

            </TableRow>
          </TableHead>
          <TableBody>
            {connections.map(c => {
              return (
                <TableRow key={'conn-' + c.id}>
                {rows.map(h => {
                  return (
                    <TableCell key={'conn-' + c.id + '-' + h.id}>
                    {c[h.id]}
                    </TableCell>
                  )})
                }
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

NetStat.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NetStat);

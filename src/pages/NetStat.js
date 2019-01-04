import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./index.css";

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
  },
});


class NetStat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: sample,
      ws: null,
    };
  }

  componentDidMount() {
    //let ws = new WebSocket('ws://' + location.host + '/ws');
//    var ws = new WebSocket('ws://10.0.0.191:8000/ws');
//    ws.onmessage = this.handleMessage.bind(this);
//    this.setState({ws: ws});
  }

  handleMessage(msg) {
    let data = JSON.parse(msg.data);
    if (data.command === 'update') {
      this.setState({
        connections: data.data,
      });
      this.sortall();
    }
  }

  render () {
    const { classes } = this.props;
    const connections = this.state.connections;
    console.log(classes);

    return (
      <ReactTable
        data={connections}
        columns={[
          {
            Header: "ID",
            accessor: "id"
          },
          {
            Header: "Remote",
            columns: [
              {
                Header: "addr",
                accessor: "raddr",
              },
              {
                Header: "port",
                accessor: "rport",
              },
            ]
          },
          {
            Header: "Local",
            columns: [
              {
                Header: "addr",
                accessor: "laddr",
              },
              {
                Header: "port",
                accessor: "lport",
              },
            ]
          },
          {
            Header: "Status",
            accessor: "status"
          }
        ]}
        style={{
         height:"400px"
        }}
        className="-stripped -heighlit"
      />
    )
  }
}

NetStat.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NetStat);

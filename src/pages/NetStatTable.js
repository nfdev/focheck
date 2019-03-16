import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from "react-table";
import "react-table/react-table.css";
import "./index.css";


const styles = theme => ({
  root: {
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

});


class NetStatTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render () {
    const { classes, connections } = this.props;

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

NetStatTable.propTypes = {
  classes: PropTypes.object.isRequired,
  connections: PropTypes.array.isRequired,
};


export default withStyles(styles)(NetStatTable);

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import request from 'superagent';


const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    textAlign: 'left',
  },
});

class LeftConsole extends React.Component {

  stateChangeHandler (e) {
    let s = e.target.value;
    request
      .post('/post')
      .send({
        type: 'return_status',
        status: s
      })
      .end(
        (err, res) => {
          if (err){
            console.log('stateChangeHandler error');
            console.log(err);
          }else{
          }
        }
      );
  }

  render () {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableBody>
            <TableRow key='url'>
              <TableCell>URL</TableCell>
              <TableCell>/pageA</TableCell>
            </TableRow>
            <TableRow key='status'>
              <TableCell>ReturnStatus</TableCell>
              <TableCell>
                <FormControl className={classes.formControl}>
                  <NativeSelect
                    defaultValue={200}
                    onChange={(e) => this.stateChangeHandler(e)}
                    input={<Input name="status" id="return-status" />}
                  >
                    <option value="" />
                    <option value={404}>404</option>
                    <option value={200}>200</option>
                  </NativeSelect>
                </FormControl>
              </TableCell>
            </TableRow>
            <TableRow key='sessions'>
              <TableCell>Connections</TableCell>
              <TableCell>100</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

LeftConsole.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftConsole);

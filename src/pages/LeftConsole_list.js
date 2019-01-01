import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

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
  constructor(props) {
    super(props);
  }

  render () {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <List className={classes.root}>
          <ListItem key="URL">
            <ListItemText primary="URL" />
            <ListItemText primary="/pageA" />
          </ListItem>
          <ListItem key="Status">
            <ListItemText primary="ReturnStatus" />
            <FormControl className={classes.formControl}>
              <NativeSelect defaultValue={200} input={<Input name="status" id="return-status" />}>
                <option value="" />
                <option value={404}>404</option>
                <option value={200}>200</option>
              </NativeSelect>
            </FormControl>
          </ListItem>
          <ListItem key="URL" alignItems='flex-start'>
            <ListItemText primary="URL" />
            <ListItemText primary="100" />
          </ListItem>
        </List>
      </Paper>
    )
  }
}

LeftConsole.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftConsole);

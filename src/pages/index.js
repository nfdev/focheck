import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withRoot from '../withRoot';
import LeftConsole from './LeftConsole';
import NetStat from './NetStat';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

class Index extends React.Component {
  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant='h4' align='center' gutterBottom>
          {'Failover Checker'}
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={4}>
            <LeftConsole />
          </Grid>
          <Grid item xs>
            <NetStat />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));

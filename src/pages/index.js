import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import LeftConsole from './LeftConsole';
import NetStat from './NetStat';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    flexGrow: 1,
    overflowX: 'auto',
    paddingTop: theme.spacing.unit * 2,
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
        <Grid container
          spacing={8}
          alignItems='center'
          justify='space-around'
        >
          <Grid item xs={12}>
            <Typography variant='h4' align='center' gutterBottom>
              {'Failover Checker'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LeftConsole />
          </Grid>
          <Grid item xs={12}>
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

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import request from 'superagent';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    overflowX: 'auto',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 80,
    textAlign: 'left',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    //flexBasis: '33.33%',
    //flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    margin: theme.spacing.unit * 1,
    color: theme.palette.text.secondary,
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

class LeftConsole extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      testResult: "none"
    };
  }

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

  accessTest (e) {
    request
      .get('http://' + window.location.hostname + '/test')
      .end(
        (err, res) => {
          if (err) {
            this.setState({testResult: 'access error'});
          }else{
            console.log(res)
            this.setState({testResult: res.statusCode});
          }

        }
      );
  }

  render () {
    const { classes } = this.props;
    let testPath = window.location.host + '/test';
    return (
      <div className={classes.root}>
        <Paper
          className={classes.paper}
          elevation={24} 
        >
        <Grid container
          spacing={24}
          alignItems='center'
          justify='space-around'>
          <Grid item xs={12} sm={4}>
            <Paper>
              <Grid container spacing={8} alignItems='center'>
                <Grid item xs={'auto'}>
                  <Typography className={classes.heading}>URL</Typography>
                </Grid>
                <Grid item xs={'auto'}>
                  <Typography className={classes.secondaryHeading}>{testPath}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.paper}>
              <Grid container spacing={8} alignItems='center'>
                <Grid item xs={'auto'}>
                  <Typography className={classes.heading}>Return Status Code</Typography>
                </Grid>
                <Grid item xs={'auto'}>
                  <FormControl className={classes.secondaryHeading}>
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
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.paper}>
              <Grid container spacing={8} alignItems='center'>
                <Grid item xs={'auto'}>
                  <Button
                    className={classes.heading}
                    onClick={(e) => this.accessTest(e)}
                  >
                    {'Access Test'}
                  </Button>
                </Grid>
                <Grid item xs={'auto'}>
                  <Typography className={classes.secondryHeading}>{this.state.testResult}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        </Paper>
      </div>
    )
  }
}

LeftConsole.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftConsole);

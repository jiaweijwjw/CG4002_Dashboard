import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// HERE
// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import People from "@material-ui/icons/People";
//core components
import CustomInput from "components/CustomInput/CustomInput.js";
// import GridItem from "components/Grid/GridItem.js";
import Input from '@material-ui/core/Input';
// TILL HERE

import { TextField, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import Button from "components/CustomButtons/Button.js";
import SendIcon from '@material-ui/icons/Send'

import { bugs, website, server } from "variables/general.js";

import { fetchSessionInfo } from "../../services/httpservice.js";

import {
  averageDelayChart,
  teamSynchronizationChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import service from '../../services/service';
import { socket, dataFromInitialSend, dataFromChangesInDB } from '../../services/socket';
// import { initialData } from '../../services/beforeRenderData';

import axios from 'axios';

const useStyles = makeStyles(styles);

export default function Team({ team }) {
  const classes = useStyles();
  // console.log(team);

  const [sessionNumber, setSessionNumber] = React.useState('');
  const [sessionChanged, setSessionChanged] = useState([]);

  const handleChange = event => {
    setSessionNumber(event.target.value);
    // let test = fetchSessionInfo(sessionNumber);
  };

  const sessionInfo = useRef([]);
  const simplifiedSession = useRef(null);

  async function fetchSessionInfo(sessionNum) {
    let res = await axios.get('/main/team/B14/' + sessionNum)
      .then(function (res) {
        console.log('sent a req to get session info');
        console.log('raw res data', res.data);
        //return res.data || [];
        setSessionChanged(res.data || []);
        // sessionInfo.current = (res.data || []);
        // console.log(sessionInfo); // this also uses old value
      })
  };


  useLayoutEffect(() => { // whats the difference from useEffect again?
    console.log('sessionInfo before useRef', sessionInfo); // only this will be the updated value
    console.log('sessionChanged before useRef', sessionChanged);
    sessionInfo.current = sessionChanged;
    console.log(simplifiedSession.current = sessionInfo.current[0]); 
    console.log('sessionInfo after useRef', sessionInfo);
    console.log('sessionChanged after useRef', sessionChanged);
  }, [sessionChanged]);

  const keyPress = async (e) => {
    if (e.key === "Enter") {
      console.log('check if sessionNumber is set by onChange:', sessionNumber); // check that it is setted by onChange
      console.log('session number fetched:', e.target.value); // check the input is recorded after Enter key
      // console.log(setSessionInfo(fetchSessionInfo(sessionNumber)));
      await fetchSessionInfo(e.target.value);
      // console.log(sessionInfo); // uses the old value
      setSessionNumber(''); // on Enter, clear the search box.
      // console.log(sessionNumber);
    }
  };



  /* var keyPress = async(e) => { // the input will go in here as e.
    if (e.key === "Enter") {
      console.log(sessionNumber);
      console.log('session number', e.target.value);
      console.log(await fetchSessionInfo(sessionNumber)); //  doesnt return, rest is ok
      // setSessionInfo(res);
      //console.log(abc); // why is it undefined
      setSessionNumber('');
      console.log(sessionNumber);
    }
  }; */


  /* const [team, setTeam] = useState(dataFromInitialSend); // returns the current state and a function that updates it.
  console.log(dataFromInitialSend); // only for the first render will have value.

  useEffect(() => { // happens after render. SOMEHOW NOT WORKING, REQUIRES REFRESH OF PAGE ONCE.
    socket.on('changes_in_db', data => {
      console.log('received change stream data');
      setTeam([data]);
      console.log('useEffect should re-render');
    });
  }, []); // THIS [] argument is important as it cleans up on unmount.


  // THIS DOES POLLING if socket is disconnected. DOES NOT REQUIRE REFRESH OF PAGE. 
  const getTeam = async () => {
    let res = await service.getAll();
    console.log(socket.connected);
    // console.log(res);
    setTeam(res);
  }
  if (!socket.connected) {
    getTeam();
    console.log('polling');
  };
  */
  function getPerformanceGrade(iteration_grade) {
    // iteration_grade only from 0-100%
    if (iteration_grade >= 90) {
      return 'Perfect';
    } else if (iteration_grade >= 70) {
      return 'Good';
    } else if (iteration_grade >= 50) {
      return 'Almost there';
    } else {
      return 'Try again';
    }
    /* use switch for the dance move indicator instead
    switch(iteration_grade){   
        case 1: return "FOO";
        case 2: return "BAR";
        case 3: return "FOOBAR";
        default: return "OK";      
    } */
  };

  function x_axis(num_of_iterations) {
    var arr = [];
    for (var i = 0; i < num_of_iterations; i++) {
      arr.push('_');
    }
    // console.log(arr);
    return arr;
  };

  function sessionNum_axis(num_of_iterations) {
    var arr = [];
    for (var i = 1; i <= num_of_iterations; i++) {
      arr.push(i);
    }
    // console.log(arr);
    return arr;
  };

  function currentSessionAxis(team) {
    var num_of_iterations = team.users[0].user_session_graph.length;
    console.log(num_of_iterations);
    var userCurrentSessionStats = {
      data: {
        labels: [] = x_axis(num_of_iterations),
        series: [team.users[0].user_session_graph]
      }
    }
    // console.log(team.users[0].user_session_graph);
    return userCurrentSessionStats.data;
  };

  function averageDelayAxis(team) {
    var num_of_iterations = team.averageDelayGraph.length;
    // console.log(num_of_iterations);
    var averageDelayStats = {
      data: {
        labels: [] = sessionNum_axis(num_of_iterations),
        series: [team.averageDelayGraph]
      }
    }
    // console.log(team.users[0].user_session_graph);
    return averageDelayStats.data;
  };

  function teamSynchronizationAxis(team) {
    var num_of_iterations = team.timing_difference_graph.length;
    // console.log(num_of_iterations);
    var teamSynchronizationStats = {
      data: {
        labels: [] = x_axis(num_of_iterations),
        series: [team.timing_difference_graph]
      }
    }
    return teamSynchronizationStats.data;
  };

  const required = true;
  const disabled = false;


  const renderTeam = team => {
    var tdg_length = team.timing_difference_graph.length;
    // console.log(tdg_length);
    var delay = (team.timing_difference_graph[tdg_length - 1] || -1);
    return (
      <div>
        <GridContainer>


          {/* Dancer1 */}
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="warning">
                <h2 className={classes.cardTitleWhite} style={{ textAlignVertical: "center", textAlign: "center", }}>Dancer 1</h2>
                {/* <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p> */}
              </CardHeader>
              <CardBody>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>current dance move :</p>
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[0].current_dance_move}</h3>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>current position :</p>
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[0].current_position}</h3>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>time in ms :</p>
                {/* <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[0].time_started}</h3> */}
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>-</h3>
              </CardBody>
            </Card>
          </GridItem>

          {/* Dancer 2 */}
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="warning">
                <h2 className={classes.cardTitleWhite} style={{ textAlignVertical: "center", textAlign: "center", }}>Dancer 2</h2>
              </CardHeader>
              <CardBody>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>current dance move :</p>
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[1].current_dance_move}</h3>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>current position :</p>
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[1].current_position}</h3>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>time in ms :</p>
                {/* <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[1].time_started}</h3> */}
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>-</h3>
              </CardBody>
            </Card>
          </GridItem>

          {/* Dancer 3 */}
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader color="warning">
                <h2 className={classes.cardTitleWhite} style={{ textAlignVertical: "center", textAlign: "center", }}>Dancer 3</h2>
              </CardHeader>
              <CardBody>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>current dance move :</p>
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[2].current_dance_move}</h3>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>current position :</p>
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[2].current_position}</h3>
                <p style={{ textAlignVertical: "center", textAlign: "center", }}>time in ms :</p>
                {/* <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[2].time_started}</h3> */}
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>-</h3>
              </CardBody>
            </Card>
          </GridItem>


          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader color={delay == -1 ? "info" : (delay > 3000 ? "danger" : "success")}>
                <h5 className={classes.cardTitleWhite}>
                  {(() => {
                    if (delay == -1) {
                      return (
                        <div style={{ textAlignVertical: "center", textAlign: "center", }}>Not yet started</div>
                      )
                    } else if (delay <= 3000) {
                      return (
                        <div style={{ textAlignVertical: "center", textAlign: "center", }}>Synchronized</div>
                      )
                    } else {
                      return (
                        <div style={{ textAlignVertical: "center", textAlign: "center", }}>Unsynchronized</div>
                      )
                    }
                  })()}
                </h5>
              </CardHeader>
              {/* <CardBody>
                <h5 style={{ textAlignVertical: "center", textAlign: "center", }}>Delay between first and last dancer : {team.users[2].time_started}</h5>
              </CardBody> */}
              <CardFooter>
                {/* <div style={{ textAlignVertical: "center", textAlign: "center", }}>Synchronization Indicator</div> */}
                <div style={{ textAlignVertical: "center", textAlign: "center", }}>Delay between first and last dancer : {team.users[2].time_started}</div>
              </CardFooter>
            </Card>
          </GridItem>


          {/* <GridItem xs={12} sm={6}>
            <Card>
              <CardHeader>
                <p className={classes.cardCategory}>Current Position:</p>
              </CardHeader>
              <CardBody>
                <h3>lol</h3>
              </CardBody>
            </Card>
          </GridItem> */}

        </GridContainer>


        <GridContainer>
          <GridItem xs={9} sm={9}> {/* CONTAINER FOR BOTH GRAPHS */}
            <GridContainer> {/* CONTAINER WITHIN CONTAINER */}

              {/* Synchronization graph */}
              <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                  <CardHeader color="primary">
                    <ChartistGraph
                      className="ct-chart"
                      data={teamSynchronizationAxis(team)}
                      type="Line"
                      options={teamSynchronizationChart.options}
                    /* listener={teamSynchronizationChart.animation} */
                    />
                  </CardHeader>
                  <CardFooter chart>
                    <div>
                      Team synchronization for each dance move. Time difference is in milliseconds.
                </div>
                  </CardFooter>
                </Card>
              </GridItem>


              {/* CURRENT SESSION GRAPH */}
              <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                  <CardHeader color="info">
                    <ChartistGraph
                      className="ct-chart"
                      data={averageDelayAxis(team)}
                      type="Line"
                      options={averageDelayChart.options}
                    // listener={currentSessionChart.animation} 
                    />
                  </CardHeader>
                  {/* <CardBody>
                    <h4 className={classes.cardTitle}>Current Session Statistics</h4>
                    <p className={classes.cardCategory}>
                      <span className={classes.successText}>
                        <ArrowUpward className={classes.upArrowCardCategory} /> 100%
                  </span>{" "}
                  increase in today sales.
                </p>
                  </CardBody> */}
                  <CardFooter chart>
                    {/* <div className={classes.stats}>
                      <AccessTime /> updated 4 minutes ago
                </div> */}
                    <div>
                      History of average delay in past sessions.
                </div>
                  </CardFooter>
                </Card>
              </GridItem>

              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardHeader color="rose">
                    <h4 className={classes.cardTitleWhite} style={{ textAlignVertical: "center", textAlign: "center", }}>Current Session Number: {team.current_session_number}</h4>
                    {/* <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p> */}
                  </CardHeader>
                  <CardBody>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className={classes.root}>


                        <div>
                          <TextField
                            id="outlined-full-width"
                            label="Which session would you like to search for?"
                            style={{ margin: 8 }}
                            placeholder="Session number"
                            helperText="Please input the desired session number. (Must be smaller than current session number)"
                            fullWidth
                            type="number"
                            InputProps={{ inputProps: { min: 1, max: team.current_session_number } }} // DOESNT WORK IN VALIDATING
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            color="secondary"
                            value={sessionNumber} // this is to show the use what they have type
                            onKeyDown={keyPress} // handle changes on Enter key
                            onChange={handleChange} // update sessionNumber on any input by user
                          />
                        </div>
                      </div>

                    </GridItem>
                    <p>
                    <h4 className={classes.cardTitle} style={{ textAlignVertical: "center", textAlign: "center", }}>Average Delay for the selected session: {(() => {
                              if (simplifiedSession.current == null) {
                                return (0)
                              } else {
                                return (
                                  ' ' + simplifiedSession.current.averageDelay + ' '
                                )
                              }
                            })()} ms</h4>
                    </p>
                    <GridItem xs={12} sm={12} md={12}>
                      <Card chart>
                        <CardHeader color="primary">
                          <ChartistGraph
                            className="ct-chart"
                            /* data={teamSynchronizationAxis(simplifiedSession.current) || []} */
                            data={(() => {
                              if (simplifiedSession.current == null) {
                                return ([])
                              } else {
                                return (
                                  teamSynchronizationAxis(simplifiedSession.current)
                                )
                              }
                            })()}
                            type="Line"
                            options={teamSynchronizationChart.options}
                          /* listener={teamSynchronizationChart.animation} */
                          />
                        </CardHeader>
                        <CardFooter chart>
                          <div>
                            Team synchronization for selected session. Time difference is in milliseconds.
                </div>
                        </CardFooter>
                      </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12}>
                      <Card>
                        <CardHeader color="warning">
                          <h4 className={classes.cardTitleWhite} style={{ textAlignVertical: "center", textAlign: "center", }}>List of dance moves done this session.</h4>
                        </CardHeader>
                        <CardBody>
                          <h4>
                            {
                              sessionInfo.current.map(session => {
                                return <ol>{session.list_of_dance_moves_done.map(dance_move => (<li>{dance_move}</li>))}</ol>
                              })
                            }
                          </h4>
                        </CardBody>
                        <CardFooter>
                          <div className={classes.stats}>
                            Dance move done by the team. If more than 2 dancers are doing the same dance move, it will be considered as a dance move, else it will be unknown.
                </div>
                        </CardFooter>
                      </Card>
                    </GridItem>
                  </CardBody>
                </Card>
              </GridItem>




              {/* PAST SESSIONS GRAPH */}
              {/* <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                  <CardHeader color="warning">
                    <ChartistGraph
                      className="ct-chart"
                      data={emailsSubscriptionChart.data}
                      type="Bar"
                      options={emailsSubscriptionChart.options}
                      responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                      listener={emailsSubscriptionChart.animation}
                    />
                  </CardHeader>
                  <CardBody>
                    <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                    <p className={classes.cardCategory}>Last Campaign Performance</p>
                  </CardBody>
                  <CardFooter chart>
                    <div className={classes.stats}>
                      <AccessTime /> campaign sent 2 days ago
                </div>
                  </CardFooter>
                </Card>
              </GridItem> */}


            </GridContainer>

            {/* LIST OF DANCE MOVES DONE */}
          </GridItem>
          <GridItem xs={3} sm={3}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite} style={{ textAlignVertical: "center", textAlign: "center", }}>List of dance moves</h4>
              </CardHeader>
              <CardBody>
                <h4>
                  {team.list_of_dance_moves.map(dance_move => (
                    <li>{dance_move}</li>
                  ))}
                </h4>
              </CardBody>
              <CardFooter>
                <div className={classes.stats}>
                  Dance move done by the team. If more than 2 dancers are doing the same dance move, it will be considered as a dance move, else it will be unknown.
                </div>
              </CardFooter>
            </Card>
          </GridItem>

        </GridContainer>

        {/* <GridItem xs={12} sm={12} >
          <Card>
            <CardHeader color="success" icon>
               <CardIcon color="success">
                  <Store />
                </CardIcon>  
              <p className={classes.cardCategory}>Current Dance Move:</p>
            </CardHeader>
            <CardBody>
              <h3>{team.users[0].current_dance_move}</h3>
              <h3>{team.users[0].current_position}</h3>
              <h3>{team.users[0].time_started}</h3>
              <h3>{team.users[1].current_dance_move}</h3>
              <h3>{team.users[1].current_position}</h3>
              <h3>{team.users[1].time_started}</h3>
              <h3>{team.users[2].current_dance_move}</h3>
              <h3>{team.users[2].current_position}</h3>
              <h3>{team.users[2].time_started}</h3>
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                 <DateRange />
                  Last 24 Hours 
              </div>
            </CardFooter>
          </Card>
        </GridItem> */}
        {/* <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Fixed Issues</p>
              <h3 className={classes.cardTitle}>75</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter>
          </Card>
        </GridItem> */}
        {/* <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Followers</p>
              <h3 className={classes.cardTitle}>+245</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
        </GridItem> */}






        {/* RAW SENSOR VALUE TABLE */}
        {/* <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="danger">
                <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"]
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer> */}
      </div>
    )
  };

  return (team.map(team => renderTeam(team)));
}


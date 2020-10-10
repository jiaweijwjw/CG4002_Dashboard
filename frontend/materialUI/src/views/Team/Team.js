import React, { useState, useEffect, useLayoutEffect } from "react";
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

import { bugs, website, server } from "variables/general.js";

import {
  currentSessionChart,
  teamSynchronizationChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import service from '../../services/service';
import { socket, dataFromInitialSend, dataFromChangesInDB } from '../../services/socket';
// import { initialData } from '../../services/beforeRenderData';
const useStyles = makeStyles(styles);

export default function Team({team}) {
  const classes = useStyles();

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

  const renderTeam = team => {
    var tdg_length = team.timing_difference_graph.length;
    console.log(tdg_length);
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
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[0].time_started}</h3>
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
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[1].time_started}</h3>
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
                <h3 style={{ textAlignVertical: "center", textAlign: "center", }}>{team.users[2].time_started}</h3>
              </CardBody>
            </Card>
          </GridItem>


          <GridItem xs={12} sm={12}>
            <Card>
              <CardHeader color={delay == -1 ? "info" : (delay > 300 ? "danger" : "success")}>
                <h5 className={classes.cardTitleWhite}>
                  {(() => {
                    if (delay == -1) {
                      return (
                        <div style={{ textAlignVertical: "center", textAlign: "center", }}>Not yet started</div>
                      )
                    } else if (delay <= 300) {
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
              {/* <CardBody><div style={{ textAlignVertical: "center", textAlign: "center", }}>Synchronization Indicator</div></CardBody> */}
              <CardFooter>
                <div style={{ textAlignVertical: "center", textAlign: "center", }}>Synchronization Indicator</div>
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
                    /* listener={currentSessionChart.animation} */
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
                      data={currentSessionAxis(team)}
                      type="Line"
                      options={currentSessionChart.options}
                    /* listener={currentSessionChart.animation} */
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
                      testing
                </div>
                  </CardFooter>
                </Card>
              </GridItem>



              {/* PAST SESSIONS GRAPH */}
              <GridItem xs={12} sm={12} md={12}>
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
              </GridItem>
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

        <GridItem xs={12} sm={12} /* md={3} */>
          <Card>
            <CardHeader color="success" /* stats */ icon>
              {/* <CardIcon color="success">
                  <Store />
                </CardIcon>  */}
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
              {/* <p>{team.users.map((user, key) => (
                    <div>
                      <h2>{user.username}</h2>
                      <h1>{user.current_position}</h1>
                      <h2>{user.current_dance_move}</h2>
                    </div>
                  ))}</p> */}
            </CardBody>
            <CardFooter stats>
              <div className={classes.stats}>
                {/* <DateRange />
                  Last 24 Hours */}
              </div>
            </CardFooter>
          </Card>



        </GridItem>
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
        <GridContainer>
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
        </GridContainer>
      </div>
    )
  };

  return (team.map(team => renderTeam(team)));
}


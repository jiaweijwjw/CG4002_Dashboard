import React, {useState, useEffect} from "react";
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
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts_copy.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

import axios from 'axios';
import service from '../../services/service';
import {socket} from '../../services/socket';



const useStyles = makeStyles(styles);

export default function Team() {
  const classes = useStyles();

  const [team, setTeam] = useState([]); // returns the current state and a function that updates it.

  useEffect(() => { // componentdidmount()
    // socket.on('changes_in_db', getTeam());
  });

  
  // requires refresh
  const getTeam = async () => {
    let res = await service.getAll();
    // console.log(res);
    setTeam(res);
  }

  socket.on('changes_in_db', getTeam());

  const renderTeam = team => {
    return (
      <div>
        <GridContainer>

          <GridItem xs={12} sm={6} /* md={3} */>
            <Card>
              <CardHeader color="warning" /* stats */ icon>
                {/* <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon> */}
                <p className={classes.cardCategory}>Performance</p>
                <h3 className={classes.cardTitle}>
                  not yet implemented {/* <small>GB</small> */}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  {/* <Danger>
                  <Warning />
                </Danger> */}
                  <p /* href="#pablo" */ /* onClick={e => e.preventDefault()} */>
                    Your performance of every move.
                </p>
                </div>
              </CardFooter>
              <GridItem sm={3}>
                <Card>
                  <CardHeader>
                    <h3 className={classes.cardTitle}>LEGEND</h3>
                  </CardHeader>
                  <CardBody>
                    <p>90 - 100% PERFECT</p>
                    <p>70 - 90% GOOD</p>
                    <p>50 - 70% ALMOST THERE</p>
                    <p>0 - 50% BAD</p>
                  </CardBody>
                </Card>
              </GridItem>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={6} /* md={3} */>
            <GridContainer>
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
                  <h3>{team.users[1].current_dance_move}</h3>
                  <h3>{team.users[1].current_position}</h3>
                  <h3>{team.users[2].current_dance_move}</h3>
                  <h3>{team.users[2].current_position}</h3>
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
              <GridItem xs={12} sm={6}>
                <Card>
                  <CardHeader>
                    <p className={classes.cardCategory}>Current Position:</p>
                  </CardHeader>
                  <CardBody>
                <h3>{team.users[0].current_position}</h3>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={6}>
                <Card>
                  <CardHeader>
                    <p className={classes.cardCategory}>Indicator</p>
                  </CardHeader>
                </Card>
              </GridItem>
            </GridContainer>
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
        </GridContainer>
        <GridContainer>
          <GridItem xs={9} sm={9}> {/* CONTAINER FOR BOTH GRAPHS */}
            <GridContainer> {/* CONTAINER WITHIN CONTAINER */}

              {/* CURRENT SESSION GRAPH */}
              <GridItem xs={12} sm={12} md={12}>
                <Card chart>
                  <CardHeader color="success">
                    <ChartistGraph
                      className="ct-chart"
                      data={dailySalesChart.data}
                      type="Line"
                      options={dailySalesChart.options}
                      listener={dailySalesChart.animation}
                    />
                  </CardHeader>
                  <CardBody>
                    <h4 className={classes.cardTitle}>Current Session Statistics</h4>
                    {/* <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 100%
                  </span>{" "}
                  increase in today sales.
                </p> */}
                  </CardBody>
                  <CardFooter chart>
                    {/* <div className={classes.stats}>
                  <AccessTime /> updated 4 minutes ago
                </div> */}
                    <div>
                      Your dance performance over time for this session.
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
              <CardHeader>
                <p className={classes.cardCategory}>List of dance moves:</p>
              </CardHeader>
            </Card>
          </GridItem>

        </GridContainer>

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
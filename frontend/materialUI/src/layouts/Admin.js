import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
// import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/NUSlogo.jpg";

import service from '../services/service';
import { socket, dataFromInitialSend, dataFromChangesInDB } from '../services/socket';

let ps;

function switchRoutes(team) {
  return (
    <Switch>
      {routes.map((prop, key) => { // routes is an array of the different routes
        if (prop.layout === "/admin") {
          return (
            <Route
              path={prop.layout + prop.path}
              // component={prop.component} 
              component={() => (<prop.component team={team} />)} // using component={} instead of render={}
              key={key}
            />
          );
        }
        return null;
      })}
      <Redirect from="/admin" to="/admin/team" />
    </Switch>
  )
};

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {


  const [team, setTeam] = useState(dataFromInitialSend); // returns the current state and a function that updates it.
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


  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image] = React.useState(bgImage);
  const [color] = React.useState("purple");
  // const [fixedClasses,] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const handleImageClick = image => {
  //   setImage(image);
  // };
  // const handleColorClick = color => {
  //   setColor(color);
  // };
  // const handleFixedClick = () => {
  //   if (fixedClasses === "dropdown") {
  //     setFixedClasses("dropdown show");
  //   } else {
  //     setFixedClasses("dropdown");
  //   }
  // };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"CG4002 B14"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes(team)}</div>
          </div>
        ) : (
            <div className={classes.map}>{switchRoutes(team)}</div>
          )}
        {/* {getRoute() ? <Footer /> : null} */}
        {/* <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        /> */}
      </div>
    </div>
  );
}

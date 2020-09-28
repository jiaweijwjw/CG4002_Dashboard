import React, {useState, useEffect} from 'react';
import './App.css';
import {Route} from "react-router-dom";
import TeamPage from "./components/TeamPage";
import axios from 'axios';
import service from './services/service';
import clientSocket from 'socket.io-client';
const socket = clientSocket('http"//localhost:5000');

function App() {
  /* const [team, setTeam] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/main/team/fuck')
    .then(res => setTeam(res.data))
    .catch(error => console.log(error));
  }); */

  const [team, setTeam] = useState(null); // returns the current state and a function that updates it.

  useEffect(() => { // componentdidmount()
    if(!team) {
      getTeam();
    }
  })

  // requires refresh. axios polling
  const getTeam = async () => {
    let res = await service.getAll();
    console.log(res);
    setTeam(res);
  }

  //real-time if there is a socket connection.
  socket.on('changes_in_db', getTeam()); // actually can directly get from server. Now we are using socket to make us poll.

  const renderTeam = team => {
    return (
      <li key={team._id} className="list__item product">
        <h3 className="product__name">{team.teamname}</h3>
        <p className="product__description">{team._id}</p>
        <p className="product__description">{team.users.map((user, key) => (
          <div>
            <h2>{user.username}</h2>
            <h1>{user.current_position}</h1>
            <h2>{user.current_dance_move}</h2>
          </div>
        ))}</p>
      </li>
    );
  };

  return (
    <div className="App">
      <ul className="list">
        {(team && team.length > 0) ? (
          team.map(team => renderTeam(team))
        ) : (
          <p>No products found</p>
        )}
      </ul>
    </div>
  );
}
  /* return (
    <div className="App">
      <Route to="/" render={() => <TeamPage team={team}/>}/>
    </div>
  );
} */

// "proxy": "http://localhost:5000",

export default App;

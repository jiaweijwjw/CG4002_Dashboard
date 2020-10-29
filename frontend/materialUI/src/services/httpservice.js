import axios from 'axios';

/* export default {
  getAll: async () => {
    let res = await axios.get(`/main/team/B14`);
    //console.log('');
    return res.data || [];
  }
}  */

export async function newSession() {
    let res = await axios.post('/main/newsession/B14');
}

/* export async function fetchSessionInfo(sessionNum) {
  let res = await axios.get('/main/team/B14/' +sessionNum )
  .then(function (res) {
    console.log('sent a req to get session info');
    
    return res.data || [];
    console.log(res.data);
  })
}  */

/* axios.get('/user', {
  params: {
    ID: 12345
  }
})
.then(function (response) {
  console.log(response);
}) */
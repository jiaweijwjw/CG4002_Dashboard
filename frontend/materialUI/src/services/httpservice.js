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

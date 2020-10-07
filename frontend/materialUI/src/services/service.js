import axios from 'axios';

export default {
  getAll: async () => {
    let res = await axios.get(`/main/team/B14`);
    //console.log('');
    return res.data || [];
  }
} 
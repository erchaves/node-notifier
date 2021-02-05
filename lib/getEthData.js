var axios = require('axios');
const ethApi = 'https://ethgasstation.info/api/ethgasAPI.json?';

const getData = settings => {
  return axios.get(ethApi)
    .then((response) => {
      // console.log('SUCCEEDED: \n', response.data);
      return response.data;
    })
    .catch((error) => {
      console.log('FAILED: \n', error);
    });
};

module.exports = {
  getData: getData,
};


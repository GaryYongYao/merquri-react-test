import axios from 'axios';

// Generic axios requests utility
export const request = async (url, body, type = 'GET') => {
  try {
    // constants options
    let perms = {
      url: `${url}`,
      method: `${type}`,
      responseType: 'json'
    }

    // if request using params
    if (body.params) perms.params = body.params;

    // if request sends in data
    if (body.data) perms.data = body.data;

    const { data } = await axios(perms)
    
    return data
  }
  catch(err) {
    throw new Error(err.response.data.message);
  }
};

// Open Weather API request
export const weatherAPIRequest = async (path, params) => {
  try {
    // path for what OpenWeather we are using
    const url = `https://api.openweathermap.org/${path}?appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`
    const data = await request(url, { params });
    
    return data;
  }
  catch(err) {
    throw new Error(err.message);
  }
}
require('dotenv').config();
const WebflowAPI = require('./webflowAPI');

const collectionID = process.env.COLLECTION_ID;
const siteID = process.env.SITE_ID;
const apiKey = process.env.API_KEY;

const webflowAPI = new WebflowAPI(apiKey);

webflowAPI.createNewItem(collectionID).then(r => console.log(r));
webflowAPI.createNewItems(collectionID).then(r => console.log(r));
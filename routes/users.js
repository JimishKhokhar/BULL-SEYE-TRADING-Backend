const express=require('express');
const router=express.Router();


//Add all Routes

//import Controller
const createUser=require('../controllers/createUser');
router.post("/createUser",createUser);


const findUser = require('../controllers/findUser');
router.post("/findUser",findUser);

const buyStock=require('../controllers/buyStock');
router.post("/buyStock",buyStock);

const findHoldings=require('../controllers/findHoldings');
router.post("/findHoldings",findHoldings);

const findBalance=require('../controllers/findBalance');
router.post('/findBalance',findBalance);


const sellTheStock=require('../controllers/sellStock');
router.post('/sellStock',sellTheStock);

const getAllTradesController=require('../controllers/getAllTrades');
router.post('/getAllTrades',getAllTradesController);

const getTopTen=require('../controllers/getTopTen')
router.get('/getTopTen',getTopTen)

const updateNetworth=require('../controllers/updateNetworth')
router.post('/updateNetworth',updateNetworth);



const addToWatchList=require('../controllers/addToWatchlistController')
router.post('/addToWatchlist',addToWatchList);

const getTheWatchlist=require('../controllers/getWatchlist')
router.post('/getWatchlist',getTheWatchlist);

const deleteFromWatchlist=require("../controllers/deleteWatchlistController");
router.delete('/deleteFromWatchlist',deleteFromWatchlist);

const getTotalUsers=require("../controllers/getTotalUsers");
router.get('/getTotalUsers',getTotalUsers);


const applyCronJob=require("../controllers/cronjob");
router.get('/cronjob',applyCronJob);

const getStockQuoteController=require("../controllers/getStockQuote");
router.post('/getStockQuote',getStockQuoteController)

const getPeersController=require("../controllers/getPeers");
router.post('/getPeers',getPeersController);

const getMetric=require("../controllers/getMetric");
router.post('/getMetric',getMetric);

const getStockProfileController=require('../controllers/getStockProfile');
router.post('/getStockProfile',getStockProfileController);

const getMarketStatusController=require('../controllers/getMarketStatus');
router.get('/getMarketStatus',getMarketStatusController);

const getTopStocksController=require('../controllers/getTopStocks');
router.post('/getAllStockQuotes',getTopStocksController)

module.exports=router;
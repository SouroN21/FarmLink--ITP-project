var cron = require('node-cron');

let biddingCronService = require("../Services/CronJobService")

cron.schedule('*/10 * * * * *', () => {
    // console.log('Running cron job every 10 seconds');
    biddingCronService.findAndUpdateBiddingExp();
    // Add your code logic here to perform tasks every 10 seconds
});

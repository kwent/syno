var Syno = require('syno.Syno');

var syno = new Syno({
    // Requests protocol : 'http' or 'https' (default: http)
    protocol: "https",
    // DSM host : ip, domain name (default: localhost)
    host: "demo.synology.com",
    // DSM port : port number (default: 5000)
    port: "5001",
    // DSM User account (required)
    account: 'admin',
    // DSM User password (required)
    passwd: 'synology'
});

syno.dl.getDownloadStationInfo(function (error, data) {
  console.log(error);
  console.log(data);
});
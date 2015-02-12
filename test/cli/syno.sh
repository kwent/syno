#!/bin/bash

URL="https://admin:synology@demo.synology.com:5001"
URL_WRONG_PROTOCOL="ftp://synology@demo.synology.com:5001"
URL_NO_PORT="https://admin:synology@demo.synology.com"
URL_NO_PORT_NO_AUTH="demo.synology.com"

node bin/syno.js fs getFileStationInfo -u $URL -d
node bin/syno.js fs getFileStationInfo -u $URL_WRONG_PROTOCOL -d
node bin/syno.js fs getFileStationInfo -u $URL_NO_PORT -d
node bin/syno.js fs getFileStationInfo -u $URL_NO_PORT_NO_AUTH -d
node bin/syno.js dl getDownloadStationInfo -u $URL -d
node bin/syno.js fs listSharedFolders -u $URL -d
node bin/syno.js fs listFiles -p '{"folder_path":"/photo"}' -u $URL -d
node bin/syno.js fs listFiles -p '{"folder_path":"/photo"}' -u $URL -P -d
node bin/syno.js dl listTasks -u $URL -d
node bin/syno.js dl listTasks -p '{"limit":0}' -u $URL -d
node bin/syno.js dl getStats -u $URL -d
node bin/syno.js downloadstation getStats -u $URL -d
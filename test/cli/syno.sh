#!/bin/bash

URL="https://admin:synology@demo.synology.com:5001"

node ../../bin/syno.js fs getFileStationInfo -u $URL
node ../../bin/syno.js dl getDownloadStationInfo -u $URL
node ../../bin/syno.js fs listSharedFolders -u $URL
node ../../bin/syno.js fs listFiles -p '{"folder_path":"/photo"}' -u $URL
node ../../bin/syno.js fs listFiles -p '{"folder_path":"/photo"}' -u $URL -P
node ../../bin/syno.js dl listTasks -u $URL
node ../../bin/syno.js dl listTasks -p '{"limit":0}' -u $URL
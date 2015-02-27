#!/bin/bash

# Colors
red () {
  echo "\033[31m"$@
}

green () {
  echo "\033[01;32m"$@
}

# Helpers
valid () {
  eval $@ > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    [ -z "$TRAVIS" ] && green "SUCCESS" || echo "SUCCESS"
    return 0
  else
    [ -z "$TRAVIS" ] && red "FAILED" || echo "FAILED"
    return 1
  fi
}

# URL Possibilities
URL="https://admin:synology@demo.synology.com:5001"
URL_WRONG_PROTOCOL="ftp://synology@demo.synology.com:5001"
URL_NO_PORT="https://admin:synology@demo.synology.com"
URL_NO_PORT_NO_AUTH="demo.synology.com"

# Link to a file of zero bytes length
# http://www.wikiwand.com/en/Magnet_URI_scheme
MAGNET_LINK="magnet:?xt=urn:ed2k:31D6CFE0D16AE931B73C59D7E0C089C0&xl=0&dn=zero_len.fil&xt=urn:bitprint:3I42H3S6NNFQ2MSVX7XZKYAYSCX5QBYJ.LWPNACQDBZRYXW3VHJVCJ64QBZNGHOHHHZWCLNQ&xt=urn:md5:D41D8CD98F00B204E9800998ECF8427E"

# A high quality 5 minute MP3 music file
# http://www.thinkbroadband.com/download.html
HTTP_FILE="http://download.thinkbroadband.com/5MB.zip"

# Tests
# Syntax: valid cmd [options] Exit code 0 (Success) expected.
# Syntax: valid ! cmd [options] Exit code 1 (Failure) expected.
echo "Begin Tests CLI :" `date`

valid "! node bin/syno.js wrong_command getFileStationInfo -u $URL -d" &&
valid "! node bin/syno.js fs wrong_method -u $URL -d" &&
valid "! node bin/syno.js wrong_method -u $URL -d" &&
valid "node bin/syno.js fs getFileStationInfo -u $URL -d" &&
valid "! node bin/syno.js fs getFileStationInfo -u $URL_WRONG_PROTOCOL -d" &&
valid "node bin/syno.js fs getFileStationInfo -u $URL_NO_PORT -d" &&
valid "node bin/syno.js fs getFileStationInfo -u $URL_NO_PORT_NO_AUTH -d" &&
valid "node bin/syno.js dl getDownloadStationInfo -u $URL -d" &&
valid "node bin/syno.js fs listSharedFolders -u $URL -d" &&
valid "node bin/syno.js fs listFiles -p '{\"folder_path\":\"/photo\"}' -u $URL -d" &&
valid "node bin/syno.js fs listFiles -p '{\"folder_path\":\"/photo\"}' -u $URL -P -d" &&
valid "node bin/syno.js dl listTasks -u $URL -d" &&
valid "node bin/syno.js dl listTasks -p '{\"limit\":0}' -u $URL -d" &&
valid "node bin/syno.js dl getStats -u $URL -d" &&
valid "node bin/syno.js downloadstation getStats -u $URL -d" &&
valid "node bin/syno.js dl createTask -u $URL -p '{\"uri\":\"$MAGNET_LINK\"}' -d" &&
valid "node bin/syno.js dl createTask -u $URL -p '{\"uri\":\"$HTTP_FILE\"}' -d" &&
valid "node bin/syno.js as getAudioStationInfo -u $URL -d" &&
valid "node bin/syno.js as listSongs -u $URL -p '{\"limit\":2}' -P -d" &&
valid "node bin/syno.js vs getVideoStationInfo -u $URL -d" &&
valid "node bin/syno.js vs listMovies -u $URL -p '{\"limit\":2}' -P -d" &&
valid "node bin/syno.js dtv listDTVChannels -u $URL -d" &&
valid "node bin/syno.js dtv listDTVPrograms -u $URL -p '{\"limit\":2}' -P -d"

echo "End Tests CLI :" `date`
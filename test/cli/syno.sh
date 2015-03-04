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

# Tests
# Syntax: valid cmd [options] Exit code 0 (Success) expected.
# Syntax: valid ! cmd [options] Exit code 1 (Failure) expected.
echo "Begin Tests CLI :" `date`

valid "node bin/syno.js -u $URL -h" &&
valid "node bin/syno.js -u $URL -V" &&
valid "! node bin/syno.js fs -c wrong_path" &&
valid "touch config_file.yaml && ! node bin/syno.js fs -c config_file.yaml && rm config_file.yaml" &&
valid "! node bin/syno.js wrong_command getFileStationInfo -u $URL -d" &&
valid "! node bin/syno.js fs wrong_method -u $URL -d" &&
valid "! node bin/syno.js wrong_command -u $URL -d" &&
valid "! node bin/syno.js fs getFileStationInfo -u $URL_WRONG_PROTOCOL -d" &&
valid "node bin/syno.js fs getFileStationInfo -u $URL_NO_PORT -d" &&
valid "node bin/syno.js fs getFileStationInfo -u $URL_NO_PORT_NO_AUTH -d"

echo "End Tests CLI :" `date`
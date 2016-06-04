#/bin/sh
# Usage: ./compile_libs.sh ../definitions/6.0

lib_directory=$1
output_filename=_full.json

for f in $(ls $lib_directory/*.lib $lib_directory/*.api); do
  str="$f $str"
done

jq -s add $str > $lib_directory/$output_filename
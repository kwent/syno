#/bin/sh
# Usage: ./compile_libs.sh ../definitions/6.0
input=$1
output=$2
version=$3
sed -i '' 's/readFileSync.*/readFileSync(__dirname + "\/..\/definitions\/'$version'\/_full.json", "utf8"));/' $input
sed -i '' '/file_path/d' $input
browserify -t brfs -r $input:syno.Syno > $output
#!/bin/sh
# Usage: ./extract_spk.sh spk_directory definition_directory
# sh extract_spk.sh usdl.synology.com/download/spk/AudioStation ../definitions/AudioStation
# sh extract_spk.sh usdl.synology.com/download/spk/DownloadStation ../definitions/DownloadStation
# sh extract_spk.sh usdl.synology.com/download/spk/SurveillanceStation ../definitions/SurveillanceStation
# sh extract_spk.sh usdl.synology.com/download/spk/VideoStation ../definitions/VideoStation
# sh extract_spk.sh usdl.synology.com/download/DSM/VideoStation/release ../definitions/DSM

spk_directory=$1
definition_directory=$2

unpack() {
  SRC=$1
  DEST=$2

  stats=$(file $SRC)

  if   [[ $(echo $stats | grep -c "POSIX tar archive")  == 1 ]];
  then
    tar xf  $SRC -C $DEST;
  elif [[ $(echo $stats | grep -c "XZ compressed data") == 1 ]];
  then
    tar xJf $SRC -C $DEST;
  else
    echo "No rules defined to untar the file: $stats"
    echo "Fallback to untar with the default command, should work with latest tar"
    tar xf  $SRC -C $DEST;
  fi
}

# extract all spk files
for spk in $(find $spk_directory -name *.spk -type f | grep -i monaco); do
  destination="${spk%.*}"
  mkdir $destination
  unpack $spk $destination
done

for package in $(find $spk_directory -type f | grep -i package.tgz); do
  destination="${package%.*}"
  mkdir $destination
  unpack $package $destination
done

for file in $(find $spk_directory -type f | grep '[0-9]/INFO'); do
  dir=$(echo $file | egrep -o '[0-9]\.[0-9](\.[0-9])?-[0-9]{4}')
  mkdir $definition_directory/$dir
  cp -f $file $definition_directory/$dir
done

for file in $(find $spk_directory -type f | egrep '\.api$|\.lib$'); do
  dir=$(echo $file | egrep -o '[0-9]\.[0-9](\.[0-9])?-[0-9]{4}')
  mkdir $definition_directory/$dir
  cp -f $file $definition_directory/$dir
done

mv ../definitions/5.x ../definitions/5.0
mv ../definitions/6.x ../definitions/6.0

for file in $(find $definition_directory -type f | grep 'INFO'); do
  dsm_version=$(grep 'firmware' $file | egrep -o '[0-9]\.[0-9]')
  dir=${file%/INFO}
  for file in $(find $dir -type f | egrep '\.api$|\.lib$'); do
    basename=$(basename $file)
    trimmed="../${file#../definitions/}"
    ln -sf $trimmed $definition_directory/../$dsm_version/$basename
  done
done

# Replace above by this FOR DSM packages ONLY
# sh extract_spk.sh ../definitions/6.0 ../definitions/DSM/6.0.2

# for file in $(find $definition_directory -type f | egrep '.lib|.api'); do
#   echo $file
#   file=..${file#../definitions}
#   ln -sf $file $spk_directory
# done

mv ../definitions/5.0 ../definitions/5.x
mv ../definitions/6.0 ../definitions/6.x

#/bin/sh
# Usage: ./extract_spk.sh spk_directory definition_directory
# sh extract_spk.sh usdl.synology.com/download/spk/AudioStation ../definitions/AudioStation
# sh extract_spk.sh usdl.synology.com/download/spk/DownloadStation ../definitions/DownloadStation
# sh extract_spk.sh usdl.synology.com/download/spk/SurveillanceStation ../definitions/SurveillanceStation
# sh extract_spk.sh usdl.synology.com/download/spk/VideoStation ../definitions/VideoStation
# sh extract_spk.sh usdl.synology.com/download/DSM/VideoStation/release ../definitions/DSM

spk_directory=$1
definition_directory=$2

# for spk in $(find $spk_directory | grep -i monaco); do
#   destination="${spk%.*}"
#   mkdir $destination
#   tar xzf $spk -C $destination
# done
# 
# for package in $(find $spk_directory | grep -i package.tgz); do
#   destination="${package%.*}"
#   mkdir $destination
#   tar xzf $package -C $destination
# done

# for file in $(find $spk_directory -type f | grep '[0-9]/INFO'); do
#   dir=$(echo $file | egrep -o '[0-9]\.[0-9](\.[0-9])?-[0-9]{4}')
#   mkdir $definition_directory/$dir
#   cp -f $file $definition_directory/$dir
# done

# for file in $(find $spk_directory -type f | egrep '\.api|\.lib'); do
#   dir=$(echo $file | egrep -o '[0-9]\.[0-9](\.[0-9])?-[0-9]{4}')
#   mkdir $definition_directory/$dir
#   cp -f $file $definition_directory/$dir
# done

# for file in $(find $definition_directory -type f | grep 'INFO'); do
#   dsm_version=$(grep 'firmware' $file | egrep -o '[0-9]\.[0-9]')
#   dir=${file%/INFO}
#   for file in $(find $dir -type f | egrep '\.api|\.lib'); do
#     basename=$(basename $file)
#     trimmed="../${file#../definitions/}"
#     ln -sf $trimmed $definition_directory/../$dsm_version/$basename
#   done
# done

# sh extract_spk.sh ../definitions/4.0 ../definitions/DSM/4.0

for file in $(find $definition_directory -type f | egrep '.lib|.api'); do
  echo $file
  file=..${file#../definitions}
  ln -sf $file $spk_directory
done
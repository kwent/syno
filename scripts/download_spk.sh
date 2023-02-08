#/bin/bash
PACKAGES=(PhotoStation)
ARCH=(bromolow monaco)

for pkg in ${PACKAGES[@]}; do
  for arch in ${ARCH[@]}; do
    if [ -n "$str" ]; then
      str="$str,*$pkg*$arch*"
    else
      str="*$pkg*$arch*"
    fi
  done
done

wget --execute="robots = off" --mirror --convert-links --no-parent --accept $str https://archive.synology.com/download/Package

for f in $(find archive.synology.com/download/Package)
do
  url=`sed -n 's/.*href="\([^"]*.spk\).*/\1/p' $f`
  wget --execute="robots = off" --mirror "$url"
done

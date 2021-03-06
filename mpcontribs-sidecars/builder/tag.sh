#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 TAG"
  echo "Example: $0 2.2.1"
  exit 1
fi

tag=$1
tag_dh="$tag+dh"
url=https://github.com/materialsproject/MPContribs/blob/$tag_dh/mpcontribs-sidecars/builder/Dockerfile
reqs=`sed 's/==/-/g' requirements.txt | tr '\n' ' ' | xargs | sed 's/ / • /g'`
echo "- [$tag]($url): $reqs" >> README.md
git add README.md
git commit -m "bump mpcontribs-sidecars/builder to $tag"
git tag $tag_dh

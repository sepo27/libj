#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "there are changes";
else
  echo "no changes";
fi

#echo "[prepublishOnl] info: Commiting changes"

#git commit -a -m "Commiting after repack"

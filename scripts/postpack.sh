#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "[postpack] info: Commiting postpack changes"
  git commit -a -m "Postpack commit"
else
  echo "[postpack] info: Nothing to commit for postpack";
fi

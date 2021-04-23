#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "[postpack] info: Commiting postpack changes"
  git commit -a --amend --no-edit
else
  echo "[postpack] info: Nothing to commit for postpack";
fi

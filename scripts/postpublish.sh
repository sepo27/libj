#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "[postpublish] info: Commiting prepublish changes"
  git commit -a -m "Postpublish commit"
else
  echo "[postpublish] info: Nothing to commit for prepublish";
fi

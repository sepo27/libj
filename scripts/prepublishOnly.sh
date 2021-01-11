#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "[prepublishOnly] info: Commiting prepublish changes"
  git commit -a -m "Prepublish changes"
else
  echo "[prepublishOnly] info: Nothing to commit for prepublish";
fi

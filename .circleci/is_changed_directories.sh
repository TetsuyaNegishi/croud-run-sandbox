#!/bin/bash

DIFF_FILES=(`git diff ${2} --name-only --relative=${1}`)

if [ ${#DIFF_FILES[@]} -eq 0 ]; then
  exit 1
else
  exit 0
fi

#!/bin/sh
if [ $NODE_ENV = "production" ];
  then \
    SCRIPT="start";
  else \
    SCRIPT="dev";
fi;

echo Running $SCRIPT ...
npm install && npm run $SCRIPT;

#!/bin/sh
if [ $NODE_ENV = "production" ];
  then \
    SCRIPT="start:prod";
  else \
    SCRIPT="start:dev";
fi;

echo Running npm install ...;
npm i;
echo Running $SCRIPT ...;
npm install && npm run $SCRIPT;

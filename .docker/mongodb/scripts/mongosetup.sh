#!/bin/bash

MONGODB1=mongo1
MONGODB2=mongo2
MONGODB3=mongo3
MONGODB4=mongo4

echo "**********************************************" ${MONGODB1}
echo "Waiting for startup.."
sleep 30
echo "done"

echo SETUP.sh time now: `date +"%T" `
mongosh --host ${MONGODB1}:30001 -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} <<EOF
var cfg = {
    "_id": "MyReplicaDb",
    "protocolVersion": 1,
    "version": 1,
    "members": [
        {
            "_id": 0,
            "host": "${MONGODB1}:30001",
            "priority": 2
        },
        {
            "_id": 1,
            "host": "${MONGODB2}:30002",
            "priority": 1
        },
        {
            "_id": 2,
            "host": "${MONGODB3}:30003",
            "priority": 1,
        }
    ]
};

rs.initiate({
  "_id": "MyReplicaDb",
  "protocolVersion": 1,
  "version": 1,
  "members": [
    {
        "_id": 0,
        "host": "mongo1:30001",
        "priority": 2
    },
    {
        "_id": 1,
        "host": "mongo2:30002",
        "priority": 1.7
    },
    {
        "_id": 2,
        "host": "mongo3:30003",
        "priority": 1,
    }]
})

db.adminCommand({
   "setDefaultRWConcern" : 1,
   "defaultWriteConcern" : {
     "w" : 1
   }
})
rs.addArb("mongo4:30004")
rs.status();
EOF

//IMPORTS AND DEFINITIONS

require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleClaimer = require('role.claimer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maintainer');
var roleWallMaintainer = require('role.wallMaintainer');
var roleMiner = require('role.miner');
var roleTransport = require('role.transport');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');

var HOME = 'E79S9';
var name, creep, towers, target, maxEnergy, currentEnergy;

var
numberOfHarvesters,
numberOfBuilders,
numberOfUpgraders,
numberOfClaimers,
numberOfMaintainers,
numberOfWallMaintainers,
numberOfMiners,
numberOfTransports,
numberOfDefenders,
numberOfAttackers
;

var numberOfLongDistanceHarvestersE78S9;

var
minimumNumberOfHarvesters = 1,
minimumNumberOfBuilders = 2,
minimumNumberOfUpgraders = 4,
minimumNumberOfClaimers = 1,
minimumNumberOfMaintainers = 4,
minimumNumberOfWallMaintainers = 2,
minimumNumberOfDefenders = 2,
minimumNumberOfAttackers = 4,
minimumNumberOfLongDistanceHarvestersE78S9 = 6
;

//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//MAIN LOOP


module.exports.loop = function () {

    // check for memory entries of died creeps by iterating over Memory.creeps
    for(name in Memory.creeps) {
        // and checking if the creep is still alive
        if(!Game.creeps[name]) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//

    // for every creep name in Game.creeps
    for(let name in Game.creeps) {
        // get the creep object
        creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
        else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'maintainer') {
            roleMaintainer.run(creep);
        }
        else if (creep.memory.role == 'wallMaintainer') {
            roleWallMaintainer.run(creep);
        }
        else if(creep.memory.role == 'miner') {
              roleMiner.run(creep);
        }
        else if(creep.memory.role == 'transport') {
             roleTransport.run(creep);
        }
        else if(creep.memory.role == 'defender') {
             roleDefender.run(creep);
        }
        else if(creep.memory.role == 'attacker') {
             roleAttacker.run(creep);
        }
    }

//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//

    // find all towers
    towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // find closes hostile creep
        target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            tower.attack(target);
        }
    }


//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//

 for (let spawnName in Game.spawns) {

    let spawn = Game.spawns[spawnName];
    let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);


    // count the number of creeps alive for each role in this room
    numberOfHarvesters          = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
    numberOfBuilders            = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
    numberOfUpgraders           = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
    numberOfClaimers            = _.sum(creepsInRoom, (c) => c.memory.role == 'claimer');
    numberOfMaintainers         = _.sum(creepsInRoom, (c) => c.memory.role == 'maintainer');
    numberOfWallMaintainers     = _.sum(creepsInRoom, (c) => c.memory.role == 'wallMaintainer');
    numberOfMiners              = _.sum(creepsInRoom, (c) => c.memory.role == 'miner');
    numberOfTransports          = _.sum(creepsInRoom, (c) => c.memory.role == 'transport');
    numberOfDefenders           = _.sum(creepsInRoom, (c) => c.memory.role == 'defender');
    numberOfAttackers           = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker').length;

    numberOfLongDistanceHarvestersE78S9 = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == 'E78S9');

    maxEnergy = spawn.room.energyCapacityAvailable;
    currentEnergy = spawn.room.energyAvailable;



    if (numberOfHarvesters == 0 && numberOfTransports == 0) {
        // if there are still miners left
        if (numberOfMiners > 0 || (spawn.room.storage != undefined && spawn.room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
            // create a transport
            name = spawn.createTransport(150);
        }
        // if there is no miner left
        else {
            // create a harvester because it can work on its own
            name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester');
        }
    }


    let sources = spawn.room.find(FIND_SOURCES);
    for (let source of sources){

        // check if all sources have miners
        let sources = spawn.room.find(FIND_SOURCES);
        // iterate over all sources
        for (let source of sources) {
            // if the source has no miner
            if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                // check whether or not the source has a container
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                });
                // if there is a container next to the source
                if (containers.length > 0) {
                    // spawn a miner
                    name = spawn.createMiner(source.id);
                    //name = Game.spawns['Core'].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: 'miner', sourceId: source.id});
                    console.log('Spawning new miner: ' + name);
                    break;
                }
            }
        }
    }


    if(numberOfHarvesters < minimumNumberOfHarvesters) {
        name = Game.spawns['Core'].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + name);
    }
    else if (numberOfTransports < numberOfMiners) {
        // try to spawn one
        name = spawn.createTransport(150);
        console.log('Spawning new transport: ' + name);
    }
    else if(numberOfUpgraders < minimumNumberOfUpgraders) {
        name = Game.spawns['Core'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + name);
    }
    else if(numberOfMaintainers < minimumNumberOfMaintainers) {
        name = Game.spawns['Core'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'maintainer', maintaining: false});
        console.log('Spawning new maintainer: ' + name);
    }
    else if (numberOfWallMaintainers < minimumNumberOfMaintainers) {
                // try to spawn one
                name = spawn.createCustomCreep(500, 'wallMaintainer');
    }
    else if(numberOfBuilders < minimumNumberOfBuilders) {
        name = Game.spawns['Core'].createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + name);
    }
    else if(numberOfClaimers < minimumNumberOfClaimers) {
        name = spawn.createClaimer('E78S9');
        console.log('Spawning new claimer: ' + name);
    }
    else if(numberOfDefenders < minimumNumberOfDefenders) {
        name = Game.spawns['Core'].createCreep([TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,MOVE], undefined, {role: 'defender', defending: false});
        console.log('Spawning new defender: ' + name);
    }
    else if(numberOfAttackers < minimumNumberOfAttackers) {
        name = spawn.createAttacker('E78S9');
        console.log('Spawning new attacker: ' + name);
    }
    else if (numberOfLongDistanceHarvestersE78S9 < minimumNumberOfLongDistanceHarvestersE78S9) {
        // try to spawn one
        name = spawn.createLongDistanceHarvester(500, 2, spawn.room.name, 'E78S9', 0);
        console.log('Spawning new Long Distance harvester: ' + name);
    }








    // if not enough longDistanceHarvesters for W52N78
    // else if (numberOfLongDistanceHarvestersW52N78 < spawn.memory.minLDHW52N78) {
    //     // try to spawn one
    //     name = spawn.createLongDistanceHarvester(energy, 1, spawn.room.name, 'W52N78', 0);
    // }







        console.clear
        console.log('****UPDATE****');
        console.log('****Resources****');
        console.log('Current Energy: ' +currentEnergy + '/' + maxEnergy);
        if(currentEnergy == maxEnergy){
        console.log('****WARNING****');
        console.log('Energy level maxed');
        console.log('****WARNING****');
        }
        console.log('****Economy****');
        console.log('Harvesters:    ' + numberOfHarvesters + '/' + minimumNumberOfHarvesters);
        console.log('LD Harvesters: ' + numberOfLongDistanceHarvestersE78S9 + '/' + minimumNumberOfLongDistanceHarvestersE78S9);
        console.log('Miners:        ' + numberOfMiners + '/');
        console.log('Transports:    ' + numberOfTransports + '/' + numberOfMiners);
        console.log('****Construction****');
        console.log('Builders:      ' + numberOfBuilders + '/' + minimumNumberOfBuilders);
        console.log('Maintainers:   ' + numberOfMaintainers + '/' + minimumNumberOfMaintainers);
        console.log('Upgraders:     ' + numberOfUpgraders + '/' + minimumNumberOfUpgraders);
        console.log('****Military****');
        console.log('Defenders:     ' + numberOfDefenders + '/' + minimumNumberOfDefenders);
        console.log('Attackers:     ' + numberOfAttackers + '/' + minimumNumberOfAttackers);
        console.log('**************');
    }

}

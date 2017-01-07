//imports
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMaintainer = require('role.maintainer');
var roleWallMaintainer = require('role.wallMaintainer');
var roleStealer = require('role.stealer');
var roleMiner = require('role.miner');
var roleTransport = require('role.transport');
var roleDefender = require('role.defender');
var roleAttacker = require('role.attacker');

var HOME = 'E79S9';

module.exports.loop = function () {
    
    // check for memory entries of died creeps by iterating over Memory.creeps
    for(var name in Memory.creeps) {
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
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
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
        else if(creep.memory.role == 'stealer') {
            roleStealer.run(creep);
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
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // find closes hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
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
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var maintainers = _.filter(Game.creeps, (creep) => creep.memory.role == 'maintainer');
    var stealers = _.filter(Game.creeps, (creep) => creep.memory.role == 'stealer');
    var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    var transports = _.filter(Game.creeps, (creep) => creep.memory.role == 'transport');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    
    var energy = spawn.room.energyCapacityAvailable;
    
    
    var numberOfWallMaintainers = _.sum(creepsInRoom, (c) => c.memory.role == 'wallMaintainer');
    var numberOfLongDistanceHarvestersE78S9 = _.sum(Game.creeps, (c) =>
            c.memory.role == 'longDistanceHarvester' && c.memory.target == 'E78S9');
    //var numberOfLongDistanceHarvestersW52N78 = _.sum(Game.creeps, (c) =>
    //        c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W52N78');
    
    
    
    

    
    if (numberOfLongDistanceHarvestersE78S9 < 0) {
        // try to spawn one
        name = spawn.createLongDistanceHarvester(500, 2, spawn.room.name, 'E78S9', 0);
        console.log('Spawning new Long Distance harvester: ' + name);
    }
    else if (numberOfWallMaintainers < 2) {
                // try to spawn one
                name = spawn.createCustomCreep(500, 'wallMaintainer');
            }
    
    
    
    if(harvesters.length < 4) {
        var newName = Game.spawns['Core'].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    }
    if(builders.length < 1) {
        var newName = Game.spawns['Core'].createCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    }
    if(upgraders.length < 8) {
        var newName = Game.spawns['Core'].createCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    }
    if(maintainers.length < 4) {
        var newName = Game.spawns['Core'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'maintainer'});
        console.log('Spawning new maintainer: ' + newName);
    }
    if(stealers.length < 0) {
        var newName = Game.spawns['Core'].createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'stealer', home: HOME, target: 'E78S9', sourceID: 0});
        console.log('Spawning new stealer: ' + newName);
    }
    if(transports.length < miners.length) {
        var newName = Game.spawns['Core'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'transport'});
        console.log('Spawning new miner: ' + newName);
    }
    if(defenders.length < 1) {
        var newName = Game.spawns['Core'].createCreep([TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,MOVE], undefined, {role: 'defender', defending: false});
        console.log('Spawning new defender: ' + newName);
    }
    if(attackers.length < 3) {
        name = spawn.createAttacker('E78S9');
        console.log('Spawning new attacker: ' + name);
    }
    
    // let sources = spawn.room.find(FIND_SOURCES);
    // for (let source of sources){
    
    
    
    
    // // check if all sources have miners
    // let sources = spawn.room.find(FIND_SOURCES);
    // // iterate over all sources
    // for (let source of sources) {
    //     // if the source has no miner
    //     if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
    //         // check whether or not the source has a container
    //         let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
    //             filter: s => s.structureType == STRUCTURE_CONTAINER
    //         });
    //         // if there is a container next to the source
    //         if (containers.length > 0) {
    //             // spawn a miner
    //             name = spawn.createMiner(source.id);
    //             //var newName = Game.spawns['Core'].createCreep([WORK,WORK,WORK,WORK,WORK,MOVE], undefined, {role: 'miner', sourceId: source.id});
    //             console.log('Spawning new miner: ' + name);
    //             break;
    //             }
    //     }
    // }
    
    
    
    
    
    // if not enough longDistanceHarvesters for W52N78
    // else if (numberOfLongDistanceHarvestersW52N78 < spawn.memory.minLDHW52N78) {
    //     // try to spawn one
    //     name = spawn.createLongDistanceHarvester(energy, 1, spawn.room.name, 'W52N78', 0);
    // }
    
    
    
    
    
    
    
        console.clear
        console.log('****UPDATE****');
        console.log('Total Energy: ' + energy);
        console.log('Harvesters: ' + harvesters.length);
        console.log('LD Harvesters: ' + numberOfLongDistanceHarvestersE78S9);
        console.log('Builders: ' + builders.length);
        console.log('Maintainers: ' + maintainers.length);
        console.log('Upgraders: ' + upgraders.length);
        console.log('Stealers: ' + stealers.length);
        console.log('Miners: ' + miners.length);
        console.log('Transports: ' + transports.length);
        console.log('Defenders: ' + defenders.length);
        console.log('Attackers: ' + attackers.length);
        console.log('**************');

    }
    
}
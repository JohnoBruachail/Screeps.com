var listOfRoles = ['harvester', 'upgrader', 'builder', 'maintainer', 'wallMaintainer', 'outpostHarvester', 'claimer', 'miner', 'scavenger', 'transport', 'defender', 'attacker' ];
var listOfGlobalRoles = ['outpostHarvester', 'outpostMiner', 'outpostReserver', 'outpostTransport', 'attacker' ];
var currentEnergy, numberOfContainers, sources, numberOfSources;

//Game.spawns.Core.memory.Creeps = { harvester: 1, transport_Multiplier: 1, builder: 2, maintainer: 2, scavenger: 1, wallMaintainer: 1, upgrader: 1, defender: 1 }
//Game.spawns.Core.memory.Claim_Room = { room: 0 }
//Game.spawns.Core.memory.Outpost_Harvesters = { room: 0, numberOfHarvesters: 0 }
//Game.spawns.Core.memory.Outpost_Builders = { room: 0, numberOfBuilders: 0 }
//Game.spawns.Core.memory.Outpost_Miners = { room_One: 0, room_Two: 0}
//Game.spawns.Core.memory.Reservers = { room_One: 0, room_One_Number_Of_Reservers: 0, room_Two: 0, room_Two_Number_Of_Reservers: 0, room_Three: 0, room_Three_Number_Of_Reservers: 0 }
//Game.spawns.Core.memory.Attackers = { room: 0, numberOfAttackers: 0 }

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () {
        /** @type {Room} */
        let room = this.room;
        // find all creeps in room
        /** @type {Array.<Creep>} */
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        // count the number of creeps alive for each role in this room
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a specific role
        /** @type {Object.<string, number>} */
        let numberOfCreeps = {};
        let numberOfGlobalCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        for (let role of listOfGlobalRoles) {
            numberOfGlobalCreeps[role] = _.sum(Game.creeps, (c) => c.memory.role == role);
        }

        let maxEnergy = room.energyCapacityAvailable;
        currentEnergy = room.energyAvailable;
        let name = undefined;


        //STARTER OR EMERGENCY SPAWNING
        //if we have no harvesters and no miners make a harvester
        if(numberOfCreeps['miner'] == 0 && numberOfContainers == 0 && this.room.controller.level == 1){
            if(numberOfCreeps['harvester'] < 2){
                name = this.createCustomCreep(300, this.room.name, 'harvester');
                console.log('Spawning a starter harvester: ' + name);
            }
            else if(numberOfCreeps['upgrader'] < 2){
              name = this.createCustomCreep(maxEnergy, this.room.name, 'upgrader');
              console.log('Spawning a starter upgrader: ' + name);
            }
            else if(numberOfCreeps['builder'] < 1){
              name = this.createCustomCreep(maxEnergy, this.room.name, 'builder');
              console.log('Spawning a starter builder: ' + name);
            }
            else if(numberOfCreeps['maintainer'] < 1){
              name = this.createCustomCreep(maxEnergy, this.room.name, 'builder');
              console.log('Spawning a starter maintainer: ' + name);
            }
        }
        else {
            // check if all sources have miners
            sources = room.find(FIND_SOURCES);
            // iterate over all sources
            for (let source of sources) {
                // if the source has no miner
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                    // check whether or not the source has a container

                    /** @type {Array.StructureContainer} */
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER});
                    // if there is a container next to the source
                    if (containers.length > 0) {
                        if (maxEnergy >= 550){
                            // spawn a miner
                            name = this.createMiner(source.id);
                            console.log('Spawning a new miner: ' + name);
                            break;
                        }
                        else{
                            name = this.createCustomCreep(maxEnergy, this.room.name, 'miner', source.id);
                            console.log('Spawning a starer miner: ' + name);
                        }
                    }
                }
            }

            numberOfContainers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER}).length;
            numberOfSources = room.find(FIND_SOURCES).length;

            if (numberOfContainers < numberOfSources){

                if (numberOfCreeps['builder'] < 2) {
                    name = this.createCustomCreep(maxEnergy, this.room.name, 'builder');
                    //console.log(this.name + " spawned a starter builder creep: " + name);
                }
                if (numberOfCreeps['maintainer'] < 1) {
                    name = this.createCustomCreep(maxEnergy, this.room.name, 'maintainer');
                    console.log(this.name + " spawned a starter maintainer creep: " + name);
                }
            }

            if (numberOfCreeps['transport'] < numberOfCreeps['miner'] * this.memory.Creeps['transport_Multiplier']) {
                //add scaling to transport
                name = this.createTransport(150);
                console.log('Spawning a transport: ' + name);
            }
        }

        // var numberOfOutpostHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'outpostHarvester')
        // if (numberOfOutpostHarvesters < this.memory.minOutpostHarvesters['E78S9']) {
        //     name = this.createOutpostHarvester(800, 4, room.name, 'E78S9', 0);
        //     console.log(this.name + " spawned a new outpost harvester creep: " + name + "for room E78S9");
        // }

        // var numberOfOutpostBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'outpostBuilder' && c.memory.targetRoom == 'E78S9')
        // if (numberOfOutpostBuilders < this.memory.minOutpostBuilders['E78S9']) {
        //     name = this.createCustomCreep(maxEnergy, 'E78S9', 'builder');
        //     console.log(this.name + " spawned a new outpost builder creep: " + name + "for room E78S9");
        // }

        // var numberOfAttackers = _.sum(Game.creeps, (c) => c.memory.role == 'attacker')
        // if (numberOfAttackers < this.memory.minAttackers['E78S9']) {
        //     name = this.createAttacker('E78S9');
        //     console.log(this.name + " spawned a new attacker creep: " + name + "for room E78S9");
        // }

        // var numberOfReservers = _.sum(Game.creeps, (c) => c.memory.role == 'reserver')
        // if (numberOfReservers < this.memory.minReservers['E78S9']) {
        //     name = this.createReserver('E78S9');
        //     console.log(this.name + " spawned a new reserver creep: " + name + "for room E78S9");
        // }

//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//

        // if none of the above caused a spawn command check for other roles
        if (name == undefined) {
            for (let role of listOfRoles) {
                // check for claim order
                if (role == 'claimer' && this.memory.Claim_Room != undefined) {
                    // try to spawn a claimer
                    name = this.createClaimer(this.memory.claimRoom);
                    // if that worked
                    if (name != undefined && _.isString(name)) {
                        // delete the claim order
                        delete this.memory.claimRoom;
                    }
                }
                // if no claim order was found, check other roles
                else if (numberOfCreeps[role] < this.memory.Creeps[role]) {
                    if(role == 'builder'){
                        name = this.createCustomCreep(maxEnergy, this.room.name, 'builder');
                    }
                    else if(role == 'defender'){
                        name = this.createDefender();
                    }
                    else if(role == 'harvester'){
                        name = this.createCustomCreep(maxEnergy, this.room.name, 'harvester');
                    }
                    else if(role == 'scavenger'){
                         name = this.createScavenger();
                    }
                    else if (role == 'maintainer'){
                        name = this.createCustomCreep(maxEnergy, this.room.name, 'maintainer');
                    }
                    else if(role == 'upgrader'){
                        name = this.createCustomCreep(maxEnergy, this.room.name, 'upgrader');
                    }
                    else if (role == 'wallMaintainer'){
                        name = this.createWallMaintainer();
                    }
                    break;
                }
            }
        }

        // print name to console if spawning was a success
        if (name != undefined && _.isString(name)) {
            console.log(this.name + " spawned a new creep: " + name + " (" + Game.creeps[name].memory.role + ")");

            console.log('****UPDATE****');
            console.log('****Economy****');
            console.log('Harvesters:        ' + numberOfCreeps['harvester'] + '/' + this.memory.Creeps['harvester']);
            console.log('Miners:            ' + numberOfCreeps['miner'] + '/' + room.find(FIND_SOURCES).length);
            console.log('Transports:        ' + numberOfCreeps['transport'] + '/' + numberOfCreeps['miner'] * this.memory.Creeps['transport_Multiplier']);
            console.log('Outpost Harvester: ' + _.sum(Game.creeps, (c) => c.memory.role == 'outpostHarvester') + '/' + this.memory.Outpost_Harvesters['E78S9']);
            console.log('****Construction****');
            console.log('Builders:          ' + numberOfCreeps['builder'] + '/' + this.memory.Creeps['builder']);
            console.log('Maintainers:       ' + numberOfCreeps['maintainer'] + '/' + this.memory.Creeps['maintainer']);
            console.log('WallMaintainers:   ' + numberOfCreeps['wallMaintainer'] + '/' + this.memory.Creeps['wallMaintainer']);
            console.log('Upgraders:         ' + numberOfCreeps['upgrader'] + '/' + this.memory.Creeps['upgrader']);
            console.log('****Military****');
            console.log('Claimers:          ' + numberOfCreeps['claimer'] + '/' + this.memory.Creeps['claimer']);
            console.log('Defenders:         ' + numberOfCreeps['defender'] + '/' + this.memory.Creeps['defender']);
            console.log('Attackers:         ' + _.sum(Game.creeps, (c) => c.memory.role == 'attacker') + '/' + this.memory.Attackers['E78S9']);
            console.log('Reservers:         ' + _.sum(Game.creeps, (c) => c.memory.role == 'reserver') + '/' + this.memory.Reservers['E78S9']);
            console.log('**************');

        }
    };

//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//


// spawn a custom creep
StructureSpawn.prototype.createCustomCreep =
    function (energy, targetRoom, roleName, sourceId) {

        if(roleName == 'miner'){
            let body = [];
            while(energy > 150){
                body.push(WORK);
                energy =- 100;
            }
            body.push(MOVE);
            return this.createCreep(body, undefined, { role: roleName, targetRoom: targetRoom, working: false, sourceId: sourceId });
        }

          //LOOP AND ADD COMPONENTS, CHECK IF OVER ENERGY CAP, IF NOT LOOP AGAIN.

        if(roleName == 'builder' || roleName == 'harvester' || roleName == 'maintainer' || roleName == 'upgrader'){
            // create a balanced body as big as possible with the given energy
            let numberOfParts = Math.floor(energy / 200);
            // make sure the creep is not too big (more than 50 parts)
            numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
            let body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }
            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, targetRoom: targetRoom, working: false });
        }

        // if(roleName == defender){
        //
        //   var numberOfToughParts = 0, numberOfAttackParts = 0, numberOfMoveParts = 0;
        //
        //   while(energy > 0){
        //
        //       numberOfToughParts =+ 2;
        //       numberOfAttackParts =+ 2;
        //       numberOfMoveParts =+ 2;
        //
        //   }
        //
        //   var body = [];
        //   for (let i = 0; i < numberOfToughParts; i++) {
        //       body.push(TOUGH);
        //   }
        //   for (let i = 0; i < numberOfToughParts; i++) {
        //       body.push(TOUGH);
        //   }
        //   for (let i = 0; i < numberOfToughParts; i++) {
        //       body.push(TOUGH);
        //   }
        //
        // }
    };


// spawn an outpost harvester
StructureSpawn.prototype.createOutpostHarvester =
    function (energy, numberOfWorkParts, home, targetRoom, sourceIndex) {
        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        let body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }

        // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
        energy -= 150 * numberOfWorkParts;

        let numberOfParts = Math.floor(energy / 100);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
            body.push(MOVE);
        }

        //quick fix to make outpost harvester correct build
        body = [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
        // create creep with the created body
        return this.createCreep(body, undefined, { role: 'outpostHarvester', home: home, targetRoom: targetRoom, sourceIndex: sourceIndex, harvesting: false });
    };

// spawn a claimer
StructureSpawn.prototype.createClaimer =
    function (targetRoom) {
        return this.createCreep([CLAIM,MOVE], undefined, { role: 'claimer', targetRoom: targetRoom, claiming: false });
    };

// spawn a reserver
StructureSpawn.prototype.createReserver =
    function (targetRoom) {
        return this.createCreep([CLAIM,MOVE], undefined, { role: 'reserver', targetRoom: targetRoom, reserving: false });
    };

// spawn a miner
StructureSpawn.prototype.createMiner =
    function (sourceId) {
        return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined,{ role: 'miner', sourceId: sourceId });
    };

StructureSpawn.prototype.createScavenger =
    function () {
            return this.createCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined,{ role: 'scavenger', scavenging: false});
    };

// spawn a wall maintainer
StructureSpawn.prototype.createWallMaintainer =
      function () {
          return this.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'wallMaintainer', maintaining: false});
      };

// spawn a defender
StructureSpawn.prototype.createDefender =
        function () {
            return this.createCreep([TOUGH,MOVE,ATTACK,ATTACK,MOVE], undefined, {role: 'defender', defending: false});
        };

// spawn an attacker
StructureSpawn.prototype.createAttacker =
        function (targetRoom) {
            return this.createCreep([TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,MOVE], undefined, {role: 'attacker', targetRoom: targetRoom, attacking: false});
        };

// spawn a transport
StructureSpawn.prototype.createTransport =
    function (energy) {
        // create a body with twice as many CARRY as MOVE parts
        var numberOfParts = Math.floor(energy / 150);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        // create creep with the created body and the role 'transport'
        return this.createCreep(body, undefined, { role: 'transport', transporting: false });
    };

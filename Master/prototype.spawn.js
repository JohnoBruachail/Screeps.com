require('prototype.spawnCreepDesigns');


var listOfEconomicRoles = ['harvester', 'miner', 'transport', 'storageManager', 'baseTurretSupplier'];
var listOfRoles = [ 'upgrader', 'builder', 'maintainer', 'wallMaintainer', 'scavenger'];
var listOfMilitaryRoles = [ 'defender' ];

var listOfGlobalEconomicRoles = ['outpostHarvester', 'outpostMiner', 'outpostTransport' ];
var listOfGlobalRoles = [ 'claimer', 'outpostReserver', 'outpostBuilder' ];
var listOfGlobalMilitaryRoles = ['attacker', 'rangedAttacker', 'zombie', 'outpostDefender', 'medic'];

var currentEnergy, numberOfContainers, sources, numberOfSources;

//Game.spawns.Core.memory.BaseCreeps = { harvester: 0, transport_Multiplier: 2, builder: 1, maintainer: 2, storageManager: 2, scavenger: 0, wallMaintainer: 1, upgrader: 4, defender: 2 }
//Game.spawns.Core.memory.Outpost_One_Creeps = { Room: 0, Outpost_Harvesters: 0, Outpost_Builders: 1, Outpost_Miners: 1, Outpost_Transport_Multiplier: 4, Outpost_Reservers: 2, Outpost_Defenders: 1 }
//Game.spawns.Core.memory.Outpost_Two_Creeps = { Room: 0, Outpost_Harvesters: 0, Outpost_Builders: 1, Outpost_Miners: 1, Outpost_Transport_Multiplier: 4, Outpost_Reservers: 2, Outpost_Defenders: 1 }
//Game.spawns.Core.memory.Military = { Room: 0, Attackers: 0, RangedAttackers:0, Medics: 0 }
//Game.spawns.Core.memory.Hoard = { Room: 0, Zombies: 0}
//Game.spawns.Core.memory.Expansion = {Room: 0, Reserver: 0, Claimer: 0, Builder: 0, Defender: 0}

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
        let numberOfEconomicCreeps = {};
        let numberOfCreeps = {};
        let numberOfMilitaryCreeps = {};

        let numberOfGlobalEconomicCreeps = {};
        let numberOfGlobalCreeps = {};
        let numberOfGlobalMilitaryCreeps = {};

        for (let role of listOfEconomicRoles) {
            numberOfEconomicCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        for (let role of listOfMilitaryRoles) {
            numberOfMilitaryCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }

        for (let role of listOfGlobalEconomicRoles) {
            numberOfGlobalEconomicCreeps[role] = _.sum(Game.creeps, (c) => c.memory.role == role && c.memory.homeRoom == room.name);
        }
        for (let role of listOfGlobalRoles) {
            numberOfGlobalCreeps[role] = _.sum(Game.creeps, (c) => c.memory.role == role && c.memory.homeRoom == room.name);
        }
        for (let role of listOfGlobalMilitaryRoles) {
            numberOfGlobalMilitaryCreeps[role] = _.sum(Game.creeps, (c) => c.memory.role == role && c.memory.homeRoom == room.name);
        }

        let maxEnergy = room.energyCapacityAvailable;
        currentEnergy = room.energyAvailable;
        let name = undefined;

        numberOfContainers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER}).length;
        numberOfSources = room.find(FIND_SOURCES).length;

        //STARTER OR EMERGENCY SPAWNING

        if(this.room.controller.level == 1){
            if(numberOfEconomicCreeps['harvester'] < 2){
                name = this.createCustomCreep(300, room.name, room.name, 'harvester');
                console.log('Spawning a starter harvester: ' + name);
            }
            else if(numberOfCreeps['upgrader'] < 2){
              name = this.createCustomCreep(maxEnergy, room.name, room.name, 'upgrader');
              console.log('Spawning a starter upgrader: ' + name);
            }
            else if(numberOfCreeps['builder'] < 2){
              name = this.createCustomCreep(maxEnergy, room.name, room.name, 'builder');
              console.log('Spawning a starter builder: ' + name);
            }
            else if(numberOfCreeps['maintainer'] < 1){
              name = this.createCustomCreep(maxEnergy, room.name, room.name, 'maintainer');
              console.log('Spawning a starter maintainer: ' + name);
            }
        }
        if(this.room.controller.level == 2){
            if(numberOfEconomicCreeps['harvester'] < 1){
                name = this.createCustomCreep(300, room.name, room.name, 'harvester');
                console.log('Spawning a starter harvester: ' + name);
            }
            else if(numberOfCreeps['upgrader'] < 1){
              name = this.createCustomCreep(maxEnergy, room.name, room.name, 'upgrader');
              console.log('Spawning a starter upgrader: ' + name);
            }
            else if(numberOfCreeps['builder'] < 1){
              name = this.createCustomCreep(maxEnergy, room.name, room.name, 'builder');
              console.log('Spawning a starter builder: ' + name);
            }
            else if(numberOfCreeps['maintainer'] < 1){
              name = this.createCustomCreep(maxEnergy, room.name, room.name, 'maintainer');
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
                        name = this.createCustomCreep(maxEnergy, room.name, room.name, 'miner', source.id);
                    }
                }
            }

            //if you cant spawn any of the following spawn an emergency harvester
            if(numberOfEconomicCreeps['miner'] == 0){
                if(numberOfEconomicCreeps['harvester'] < 2){
                    name = this.createCustomCreep(300, room.name, room.name, 'harvester');
                    console.log('SPAWNING AN EMERGENCY HARVESTER!!!: ' + name);
                }
            }

            if (numberOfContainers < numberOfSources){

                if (numberOfCreeps['builder'] < 1) {
                    name = this.createCustomCreep(maxEnergy, room.name, room.name, 'builder');
                    //console.log(this.name + " spawned a starter builder creep: " + name);
                }
                if (numberOfCreeps['maintainer'] < 1) {
                    name = this.createCustomCreep(maxEnergy, room.name, room.name, 'maintainer');
                    console.log(this.name + " spawned a starter maintainer creep: " + name);
                }
            }

            if (this.room.storage != undefined && numberOfEconomicCreeps['storageManager'] < this.memory.BaseCreeps['storageManager']) {
                name = this.createTransport(300, room.name, 'storageManager');
                console.log('Spawning a storage manager: ' + name);
            }

            if (this.room.storage != undefined && numberOfEconomicCreeps['baseTurretSupplier'] < this.memory.BaseCreeps['TurretSupplier']) {
                name = this.createTransport(300, room.name, 'baseTurretSupplier');
                console.log('Spawning a turret supplier: ' + name);
            }

            if (numberOfEconomicCreeps['transport'] < numberOfEconomicCreeps['miner'] * this.memory.BaseCreeps['transport_Multiplier']) {
                //add scaling to transport
                name = this.createTransport(300, room.name, 'transport');
                console.log('Spawning a transport: ' + name);
            }
        }

//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//

        // if none of the above were triggered then check economic creeps
        if (name == undefined) {

            // Check if i'm missing economic creeps and create them if missing them
            for (let role of listOfEconomicRoles) {

                // if no claim order was found, check other roles
                if (numberOfEconomicCreeps[role] < this.memory.BaseCreeps[role]) {
                    if(role == 'harvester'){
                        name = this.createCustomCreep(maxEnergy, room.name, room.name, 'harvester');
                    }
                }
            }
        }

        if (name == undefined) {
            for (let role of listOfGlobalMilitaryRoles) {
                if (role == 'outpostDefender'){
                    if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostDefender' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room']) < this.memory.Outpost_One_Creeps['Outpost_Defenders'] && this.memory.Outpost_One_Creeps['Room'] != 0){
                        name = this.createOutpostDefender(maxEnergy, room.name, this.memory.Outpost_One_Creeps['Room']);
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostDefender' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room']) < this.memory.Outpost_Two_Creeps['Outpost_Defenders'] && this.memory.Outpost_Two_Creeps['Room'] != 0){
                        name = this.createOutpostDefender(maxEnergy, room.name, this.memory.Outpost_Two_Creeps['Room']);
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostDefender' && c.memory.targetRoom == this.memory.Expansion['Room']) < this.memory.Expansion['Defenders'] && this.memory.Expansion['Room'] != 0){
                        name = this.createOutpostDefender(maxEnergy, room.name, this.memory.Expansion['Room']);
                    }
                }
            }
        }

        if (name == undefined) {
            for (let role of listOfGlobalEconomicRoles) {

                if (role == 'outpostHarvester'){
                    if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostHarvester' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room']) < this.memory.Outpost_One_Creeps['Outpost_Harvesters'] && this.memory.Outpost_One_Creeps['Room'] != 0){
                        name = this.createOutpostHarvester(maxEnergy, room.name, this.memory.Outpost_One_Creeps['Room'], 0);
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostHarvester' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room']) < this.memory.Outpost_Two_Creeps['Outpost_Harvesters'] && this.memory.Outpost_Two_Creeps['Room'] != 0){
                        name = this.createOutpostHarvester(maxEnergy, room.name, this.memory.Outpost_Two_Creeps['Room'], 0);
                    }
                }
                else if (role == 'outpostMiner'){
                    if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostMiner' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room']) < this.memory.Outpost_One_Creeps['Outpost_Miners'] && this.memory.Outpost_One_Creeps['Room'] != 0){
                        name = this.createOutpostMiner(maxEnergy, room.name, this.memory.Outpost_One_Creeps['Room']);
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostMiner' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room']) < this.memory.Outpost_Two_Creeps['Outpost_Miners'] && this.memory.Outpost_Two_Creeps['Room'] != 0){
                        name = this.createOutpostMiner(maxEnergy, room.name, this.memory.Outpost_Two_Creeps['Room']);
                    }
                }
                else if (role == 'outpostTransport'){
                    if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostTransport' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room']) < (_.sum(Game.creeps, (c) => c.memory.role == 'outpostMiner' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room'])) * this.memory.Outpost_One_Creeps['Outpost_Transport_Multiplier'] && this.memory.Outpost_One_Creeps['Room'] != 0){
                        name = this.createOutpostTransport(550, room.name, this.memory.Outpost_One_Creeps['Room'] );
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostTransport' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room']) < (_.sum(Game.creeps, (c) => c.memory.role == 'outpostMiner' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room'])) * this.memory.Outpost_Two_Creeps['Outpost_Transport_Multiplier'] && this.memory.Outpost_Two_Creeps['Room'] != 0){
                        name = this.createOutpostTransport(550, room.name, this.memory.Outpost_Two_Creeps['Room'] );
                    }
                }
            }
        }

        for (let role of listOfRoles) {

            // if no claim order was found, check other roles
            if (numberOfCreeps[role] < this.memory.BaseCreeps[role]) {
                if(role == 'builder'){
                    name = this.createCustomCreep(maxEnergy, room.name, room.name, 'builder');
                }
                else if(role == 'scavenger'){
                     name = this.createScavenger();
                }
                else if (role == 'maintainer'){
                    name = this.createCustomCreep(maxEnergy, room.name, room.name, 'maintainer');
                }
                else if(role == 'upgrader'){
                    name = this.createCustomCreep(maxEnergy, room.name, room.name, 'upgrader');
                }
                else if (role == 'wallMaintainer'){
                    name = this.createCustomCreep(maxEnergy, room.name, room.name, 'wallMaintainer');
                }
                break;
            }
        }
        if (name == undefined) {
            // Check if i'm missing economic creeps and create them if missing them
            for (let role of listOfMilitaryRoles) {
                if(this.room.find(FIND_HOSTILE_CREEPS).length > 0){

                    if (numberOfMilitaryCreeps[role] < this.memory.BaseCreeps[role]) {
                        if(role == 'defender'){
                            name = this.createDefender(currentEnergy, room.name);
                            console.log('Hostiles Detected, Spawning Defenders');
                        }
                    }
                }
            }
        }

        if (name == undefined) {
            for (let role of listOfGlobalMilitaryRoles) {
                if (role == 'attacker'){
                    if (numberOfGlobalMilitaryCreeps['attacker'] < this.memory.Military['Attackers'] && this.memory.Military['Room'] != 0){
                        name = this.createAttacker(maxEnergy, room.name, this.memory.Military['Room']);

                    }
                }
                if (role == 'rangedAttacker'){
                    if (numberOfGlobalMilitaryCreeps['rangedAttacker'] < this.memory.Military['RangedAttackers'] && this.memory.Military['Room'] != 0){
                        name = this.createRangedAttacker(maxEnergy, room.name, this.memory.Military['Room']);

                    }
                }
                if (role == 'zombie'){
                    if (numberOfGlobalMilitaryCreeps['zombie'] < this.memory.Hoard['Zombies'] && this.memory.Hoard['Room'] != 0){
                        name = this.createZombie(maxEnergy, room.name, this.memory.Hoard['Room']);
                    }
                }
                if (role == 'medic'){
                    if (numberOfGlobalMilitaryCreeps['medic'] < this.memory.Military['Medics'] && this.memory.Military['Room'] != 0){
                        name = this.createMedic(maxEnergy, room.name, this.memory.Military['Room']);
                    }
                }
            }
        }
        if(name == undefined){
            for (let role of listOfGlobalRoles) {

                // check for claim order
                if (role == 'claimer' && this.memory.Expansion['Claimers'] > 0 && this.memory.Expansion['Room'] != 0 ) {
                    // try to spawn a claimer
                    name = this.createClaimer(this.memory.Expansion['Room']);
                    console.log('made a claimer')
                    // if that worked
                    if (name != undefined && _.isString(name)) {
                        // set the number of claimers to 0, we dont need more
                        this.memory.Expansion['Claimers'] = 0;
                    }
                }

                else if (role == 'outpostReserver'){
                    if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostReserver' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room']) < this.memory.Outpost_One_Creeps['Outpost_Reservers'] && this.memory.Outpost_One_Creeps['Room'] != 0){
                        name = this.createOutpostReserver(maxEnergy, room.name, this.memory.Outpost_One_Creeps['Room']);
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostReserver' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room']) < this.memory.Outpost_One_Creeps['Outpost_Reservers'] && this.memory.Outpost_Two_Creeps['Room'] != 0){
                        name = this.createOutpostReserver(maxEnergy,  room.name, this.memory.Outpost_Two_Creeps['Room']);
                    }
                    else if(_.sum(Game.creeps, (c) => c.memory.role == 'outpostReserver' && c.memory.targetRoom == this.memory.Expansion['Room']) < this.memory.Expansion['Reservers'] && this.memory.Expansion['Room'] != 0){
                        name = this.createOutpostReserver(maxEnergy,  room.name, this.memory.Expansion['Room']);
                    }
                }
                else if (role == 'outpostBuilder'){
                    if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostBuilder' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room']) < this.memory.Outpost_One_Creeps['Outpost_Builders'] && this.memory.Outpost_One_Creeps['Room'] != 0){
                        name = this.createCustomCreep(maxEnergy,  room.name, this.memory.Outpost_One_Creeps['Room'], 'outpostBuilder');
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostBuilder' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room']) < this.memory.Outpost_Two_Creeps['Outpost_Builders'] && this.memory.Outpost_Two_Creeps['Room'] != 0){
                        name = this.createCustomCreep(maxEnergy,  room.name, this.memory.Outpost_Two_Creeps['Room'], 'outpostBuilder');
                    }
                    else if (_.sum(Game.creeps, (c) => c.memory.role == 'outpostBuilder' && c.memory.targetRoom == this.memory.Expansion['Room']) < this.memory.Expansion['Builders'] && this.memory.Expansion['Room'] != 0){
                        name = this.createCustomCreep(maxEnergy,  room.name, this.memory.Expansion['Room'], 'outpostBuilder');
                    }
                }
            }
        }

        // print name to console if spawning was a success
        if (name != undefined && _.isString(name)) {
            console.log(this.name + " spawned a new creep: " + name + " (" + Game.creeps[name].memory.role + ")");

            console.log('****UPDATE****');
            console.log('****Economy****');
            console.log('Harvesters:          ' + numberOfEconomicCreeps['harvester'] + '/' + this.memory.BaseCreeps['harvester']);
            console.log('Miners:              ' + numberOfEconomicCreeps['miner'] + '/' + room.find(FIND_SOURCES).length);
            console.log('Transports:          ' + numberOfEconomicCreeps['transport'] + '/' + numberOfEconomicCreeps['miner'] * this.memory.BaseCreeps['transport_Multiplier']);
            console.log('****Construction****');
            console.log('Builders:            ' + numberOfCreeps['builder'] + '/' + this.memory.BaseCreeps['builder']);
            console.log('Maintainers:         ' + numberOfCreeps['maintainer'] + '/' + this.memory.BaseCreeps['maintainer']);
            console.log('WallMaintainers:     ' + numberOfCreeps['wallMaintainer'] + '/' + this.memory.BaseCreeps['wallMaintainer']);
            console.log('Upgraders:           ' + numberOfCreeps['upgrader'] + '/' + this.memory.BaseCreeps['upgrader']);
            console.log('****Outposts****');
            console.log('Outpost Builders:    ' + numberOfGlobalCreeps['outpostBuilder']);
            console.log('Outpost Harvesters:  ' + numberOfGlobalEconomicCreeps['outpostHarvester']);
            console.log('Outpost Reservers:   ' + numberOfGlobalCreeps['outpostReserver']);
            console.log('Outpost Miners:      ' + numberOfGlobalEconomicCreeps['outpostMiner'] + '/' + (this.memory.Outpost_One_Creeps['Outpost_Miners'] + this.memory.Outpost_Two_Creeps['Outpost_Miners']));
            console.log('Outpost Transports:  ' + numberOfGlobalEconomicCreeps['outpostTransport'] + '/' + ((_.sum(Game.creeps, (c) => c.memory.role == 'outpostMiner' && c.memory.targetRoom == this.memory.Outpost_One_Creeps['Room']) * this.memory.Outpost_One_Creeps['Outpost_Transport_Multiplier']) + (_.sum(Game.creeps, (c) => c.memory.role == 'outpostMiner' && c.memory.targetRoom == this.memory.Outpost_Two_Creeps['Room']) * this.memory.Outpost_Two_Creeps['Outpost_Transport_Multiplier'])))
            console.log('****Military****');
            console.log('Claimers:            ' + numberOfGlobalCreeps['claimer']);
            console.log('Attackers:           ' + numberOfGlobalMilitaryCreeps['attacker'] + '/' + this.memory.Military['Attackers']);
            console.log('Defenders:           ' + numberOfMilitaryCreeps['defender'] + '/' + this.memory.BaseCreeps['defender']);
            console.log('Outpost Defenders:   ' + numberOfGlobalMilitaryCreeps['outpostDefender'] + '/' + (this.memory.Outpost_One_Creeps['Outpost_Defenders'] + this.memory.Outpost_Two_Creeps['Outpost_Defenders']));
            console.log('**************');

        }
    };

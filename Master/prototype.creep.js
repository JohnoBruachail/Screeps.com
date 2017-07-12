var roles = {
    harvester:                  require('role.harvester'),
    miner:                      require('role.miner'),
    transport:                  require('role.transport'),
    upgrader:                   require('role.upgrader'),
    builder:                    require('role.builder'),
    maintainer:                 require('role.maintainer'),
    wallMaintainer:             require('role.wallMaintainer'),
    storageManager:             require('role.storageManager'),
    baseTurretSupplier:         require('role.baseTurretSupplier'),

    claimer:                    require('role.claimer'),
    scavenger:                  require('role.scavenger'),
    defender:                   require('role.defender'),
    attacker:                   require('role.attacker'),
    rangedAttacker:             require('role.rangedAttacker'),
    zombie:                     require('role.zombie'),
    medic:                      require('role.medic'),

    outpostDefender:            require('role.outpostDefender'),
    outpostHarvester:           require('role.outpostHarvester'),
    outpostMiner:               require('role.outpostMiner'),
    outpostReserver:            require('role.outpostReserver'),
    outpostTransport:           require('role.outpostTransport'),
    outpostBuilder:             require('role.builder'),
};

Creep.prototype.runRole =
    function () {
        roles[this.memory.role].run(this);
    };

/** @function
    @param {bool} useDropped
    @param {bool} useContainer
    @param {bool} useSource */
Creep.prototype.getEnergy =
    function (useDropped, useStorage, useContainer, useSource) {
        /** @type {StructureContainer} */
        let droppedEnergy, storage, container, source;

        //if use dropped energy is true then look for dropped energy
        if(useDropped && this.room.find(FIND_DROPPED_ENERGY).length > 0){
            droppedEnergy = this.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            // if one was found
            if (droppedEnergy != undefined) {
                if(this.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    this.moveTo(this.pos.findClosestByPath(FIND_DROPPED_ENERGY), {reusePath:25});
                }
            }
        }
        // if use the storage is true or no dropped energy was found the creep should look for energy in storage
        if (useStorage && droppedEnergy == undefined) {
            // find closest storage

            storage = this.room.storage;
            // if one was found
            if (storage != undefined) {
                // try to withdraw energy, if the container is not in range
                if (this.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    this.moveTo(storage, {reusePath:25});
                }
            }
        }
        // if use containers is true or no storage was found the creep should look for energy in containers
        if (useContainer && droppedEnergy == undefined && storage == undefined) {
            // find closest container
            container = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => (s.structureType == STRUCTURE_CONTAINER) && s.store[RESOURCE_ENERGY] > 0});
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    this.moveTo(container, {reusePath:25});
                }
            }
        }
        // if use source is true or if no container was found the Creep should look for energy at sources
        if (useSource && droppedEnergy == undefined && storage == undefined && container == undefined) {
            // find closest source
            source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // try to harvest energy, if the source is not in range
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(source);
            }
        }
    };

Creep.prototype.deliverEnergy =
    function () {

        //delever energy to the storage
        var structure = this.room.storage;
        //console.log('the storage is ' + structure)
        console.log('name ' + this.name + 'the storage manager search ' + this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'storageManager'}).length)
        if (structure == undefined || this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'storageManager'}).length < 1) {
            console.log('name ' + this.name + 'the storage manager search ' + this.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'storageManager'}).length)
            // find closest spawn, extension or tower which is not full
            structure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity});
        }

        // if we found one
        if (structure != undefined) {
            // try to transfer energy, if it is not in range
            if (this.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(structure);
            }
        }
    };

Creep.prototype.scavengeMinerals =
    function () {
        //if use dropped energy is true then look for dropped energy
        if(this.room.find(FIND_DROPPED_RESOURCES, {filter: (d) => {return (d.resourceType != RESOURCE_ENERGY)}}).length > 0){
            droppedEnergy = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (d) => {return (d.resourceType != RESOURCE_ENERGY)}});
            // if one was found
            if (droppedEnergy != undefined) {
                if(this.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    this.moveTo(this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (d) => {return (d.resourceType != RESOURCE_ENERGY)}}), {reusePath:25});
                }
            }
        }
        else{
          return false;
        }
    };

Creep.prototype.deliverMinerals =
    function () {
        //delever energy to the storage
        var structure = this.room.storage;
            // try to transfer energy, if it is not in range
            if (this.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(structure);
            }
    };

Creep.prototype.retreat =
    function () {
          if(this.room.name != this.memory.homeRoom){
              this.moveTo(this.pos.findClosestByPath(this.room.findExitTo(this.memory.homeRoom)), {reusePath:25});
          }
          else{
              this.moveTo(this.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER} }), {reusePath:25})
          }
    };

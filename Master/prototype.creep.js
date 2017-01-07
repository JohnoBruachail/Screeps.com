var roles = {
    harvester:              require('role.harvester'),
    upgrader:               require('role.upgrader'),
    builder:                require('role.builder'),
    maintainer:             require('role.maintainer'),
    wallMaintainer:         require('role.wallMaintainer'),
    outpostHarvester:       require('role.outpostHarvester'),
    claimer:                require('role.claimer'),
    outpostReserver:        require('role.outpostReserver'),
    miner:                  require('role.miner'),
    scavenger:              require('role.scavenger'),
    transport:              require('role.transport'),
    defender:               require('role.defender'),
    attacker:               require('role.attacker'),

    //just gona test this
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
    function (useDropped, useContainer, useSource) {
        /** @type {StructureContainer} */
        let container;

        if(useDropped){
            var droppedEnergy = this.pos.findClosestByRange(FIND_DROPPED_ENERGY);

            // if one was found
            if (droppedEnergy != undefined) {
                if(this.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    this.moveTo(droppedEnergy);
                }
            }
        }

        // if no dropped energy was found and the Creep should look for containers
        if (droppedEnergy == undefined && useContainer) {
            // find closest container
            container = this.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                             s.store[RESOURCE_ENERGY] > 0
            });
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    this.moveTo(container);
                }
            }
        }

        // if no container was found and the Creep should look for Sources
        if (container == undefined && useSource) {
            // find closest source
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

            // try to harvest energy, if the source is not in range
            if (this.harvest(source) == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(source);
            }
        }
    };

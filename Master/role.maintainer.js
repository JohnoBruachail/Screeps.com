var roleScavenger = require('role.scavenger');

module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }
        if(creep.hits == creep.hitsMax){
            // if creep is supposed to repair something
            if (creep.memory.working == true) {

                //find closest tower which is not full
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity});

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
                if (structure == undefined) {
                    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL});

                    // if we find one
                    if (structure != undefined) {
                        // try to repair it, if it is out of range
                        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                            // move towards it
                            creep.moveTo(structure, {reusePath:25});
                        }
                    }
                }
            }
            else{
                //creep.scavengeMinerals();
                //check if there are minerals on the ground, if yes run scavenger()
                if(creep.room.find(FIND_DROPPED_RESOURCES, {filter: (d) => {return (d.resourceType != RESOURCE_ENERGY)}}).length > 0 && this.room.storage != undefined){
                      roleScavenger.run(creep);
                }else{
                    creep.getEnergy(true, true, true, true);
                }
            }
        }else{
            creep.retreat();
        }
    }
};

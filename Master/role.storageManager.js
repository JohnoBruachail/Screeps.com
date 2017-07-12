module.exports = {

    // a function to run the logic for this role
    run: function(creep) {

        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.transporting == true && creep.carry.energy == 0) {
            // switch state

            creep.memory.transporting = false;

        }
        // if creep is harvesting energy but is full
        else if (creep.memory.transporting == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.transporting = true;

        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.transporting == true) {

            structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity});
        
            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }

        }
        // if creep is supposed to get energy
        else {

            var structure = creep.room.storage;
            // if one was found
            if (structure != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
        }
    }
};

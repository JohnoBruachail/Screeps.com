module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function(creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == false && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = true;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == true && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = false;
        }
        if(creep.hits == creep.hitsMax){
            // if creep is supposed to transfer energy to a structure
            if (creep.memory.working == false) {
                creep.deliverEnergy();
            }
            // if creep is supposed to harvest energy from source
            else {
                creep.getEnergy(false, false, false, true);
            }
        }
        else{
            creep.retreat();
        }
    }
};

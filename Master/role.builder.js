var roleMaintainer = require('role.maintainer');

module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {
        // if target is defined and creep is not in target room
        if (creep.memory.targetRoom != undefined && creep.room.name != creep.memory.targetRoom) {
            // find exit to target room
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(creep.memory.targetRoom)), {reusePath:25});
            // return the function to not do anything else
            return;
        }else{

            // if creep is trying to complete a constructionSite but has no energy left
            if (creep.memory.working == true && creep.carry.energy == 0) {
                // switch state
                creep.memory.working = false;
            }
            // if creep is harvesting energy but is full
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                // switch state
                creep.memory.working = true;
            }

            // if creep is supposed to complete a constructionSite
            if (creep.memory.working == true) {
                // find closest constructionSite
                var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                // if one is found
                if (constructionSite != undefined) {
                    // try to build, if the constructionSite is not in range
                    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        // move towards the constructionSite
                        creep.moveTo(constructionSite, {reusePath:25});
                    }
                }
                // if no constructionSite is found
                else {
                    // go upgrading the controller
                    roleMaintainer.run(creep);
                }
            }
            // if creep is supposed to get energy
            else {

                let numberOfContainers = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER}).length;
                let numberOfSources = creep.room.find(FIND_SOURCES).length;


                if(numberOfContainers < numberOfSources){
                    creep.getEnergy(false, false, false, true);
                }
                else{
                    creep.getEnergy(false, true, true, true);
                }


            }
        }
    }
};

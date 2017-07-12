module.exports = {

    // a function to run the logic for this role
    run: function(creep) {

        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.transporting == true && creep.carry.energy == 0) {
            // switch state

            creep.memory.transporting = false;

            var containers = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER});

            var targetContainer;
            var mostEnergy = 0;

            for (let container of containers) {

                if(container.store[RESOURCE_ENERGY] >= mostEnergy){

                    mostEnergy = container.store[RESOURCE_ENERGY];
                    targetContainer = container.id;

                }

            }

            creep.memory.targetContainer = targetContainer;

        }
        // if creep is harvesting energy but is full
        else if (creep.memory.transporting == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.transporting = true;

        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.transporting == true) {

            creep.deliverEnergy();

        }
        // if creep is supposed to get energy
        else {
            // find closest container
            // let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            //     filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            // });

            if (targetContainer == undefined) {
                targetContainer = creep.room.storage;
            }

            // if one was found
            //if (targetContainer != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(Game.getObjectById(creep.memory.targetContainer), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(Game.getObjectById(creep.memory.targetContainer), {reusePath:25});
                }
                // if (creep.withdraw(creep.memory.targetContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //     // move towards it
                //     creep.moveTo(creep.memory.targetContainer);
                // }
            //}
        }
    }
};

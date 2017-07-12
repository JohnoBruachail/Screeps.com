module.exports = {

    // a function to run the logic for this role
    run: function(creep) {

        let targetContainer;

        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.transporting == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.transporting = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.transporting == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.transporting = true;
            creep.memory.targetContainer = 0;
        }

        if(creep.hits == creep.hitsMax){
            if (creep.memory.transporting == true) {
                if (creep.room.name != creep.memory.homeRoom ) {
                    // find exit to home room
                    var exit = creep.room.findExitTo(creep.memory.homeRoom);
                    // and move to exit
                    creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});
                }
                else{
                    creep.deliverEnergy();
                }
            }else{
                if(creep.room.name != creep.memory.targetRoom){
                    var exit = creep.room.findExitTo(creep.memory.targetRoom);
                    // and move to exit
                    creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});
                }else{
                    if(creep.memory.targetContainer == 0){
                        var containers = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER});
                        var mostEnergy = 0;

                        for (let container of containers) {
                            if(container.store[RESOURCE_ENERGY] >= mostEnergy){
                                  mostEnergy = container.store[RESOURCE_ENERGY];
                                  targetContainer = container.id;
                            }
                        }
                        creep.memory.targetContainer = targetContainer;
                    }
                    if(Game.getObjectById(creep.memory.targetContainer).store[RESOURCE_ENERGY] > 0){
                        //console.log('the container has energy!!! ' + Game.getObjectById(creep.memory.targetContainer).store[RESOURCE_ENERGY]);
                        if (creep.withdraw(Game.getObjectById(creep.memory.targetContainer), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            // move towards it
                            creep.moveTo(Game.getObjectById(creep.memory.targetContainer), {reusePath:25});
                        }
                    }
                    else{
                        var outpostDepoFlag = creep.room.find(FIND_FLAGS, {filter: f => f.color == COLOR_ORANGE});
                        creep.moveTo(outpostDepoFlag[0], {reusePath:25})
                    }
                }
            }
        }
        else{
            creep.retreat();
        }
    }
};

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {

        if(creep.hits == creep.hitsMax){
            // if in target room
            if (creep.room.name != creep.memory.targetRoom) {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});
            }

            if (creep.room.name == creep.memory.targetRoom ) {

                if (creep.memory.sourceId == 0){
                    // check if all sources have miners
                    sources = creep.room.find(FIND_SOURCES);
                    creepsInRoom = creep.room.find(FIND_MY_CREEPS);
                    // iterate over all sources
                    for (let source of sources) {
                        // if the source has no miner
                        if (!_.some(creepsInRoom, c => c.memory.role == 'outpostMiner' && c.memory.sourceId == source.id)) {
                            // check whether or not the source has a container

                            /** @type {Array.StructureContainer} */
                            let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType == STRUCTURE_CONTAINER});
                            // if there is a container next to the source
                            if (containers.length > 0) {

                                //set miners target source to this
                                creep.memory.sourceId = source.id;
                                //break;
                            }
                        }
                    }
                }
                else {

                    let source = Game.getObjectById(creep.memory.sourceId);
                    // find container next to source
                    let container = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];

                    // if creep is on top of the container
                    if (creep.pos.isEqualTo(container.pos)) {
                        // harvest source
                        creep.harvest(source);
                    }
                    // if creep is not on top of the container
                    else {
                        // move towards it
                        creep.moveTo(container, {reusePath:25});
                    }
                }
            }
        }else{
            creep.retreat();
        }
    }
};

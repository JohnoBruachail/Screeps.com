module.exports = {

    run: function(creep) {
       
       //if empty but not target room
       if(creep.carry.energy < creep.carryCapacity && creep.room.name != creep.memory.target) {
          
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        //if empty and in target room
        else if(creep.carry.energy < creep.carryCapacity && creep.room.name == creep.memory.target){
            // find closest container
           
           
            var container = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});

            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container);
                }
            }
        }
        //if full and not in home room
        else if (creep.carry.energy == creep.carryCapacity && creep.room.name != creep.memory.home){
            // find exit to home room
            var exit = creep.room.findExitTo(creep.memory.home);
            // and move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else if (creep.carry.energy == creep.carryCapacity && creep.room.name == creep.memory.home){
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
                });

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
        }
    }
};
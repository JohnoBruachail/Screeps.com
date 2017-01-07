module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is retreating but has fully repaired
        if (creep.memory.retreating == true && creep.hits > 20) {
            creep.memory.retreating = false;
            //creep.say('moving to target');
        }
        // if creep is attacking but is running low on HP
        else if (creep.memory.retreating == false && creep.hits < 20) {
            // switch state
            creep.memory.retreating = true;
            //creep.say('retreating');
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.retreating == true) {
            
            if (creep.room.name == creep.memory.home) {

                creep.moveTo(Game.flags.Repair_Station);
            }
 
        }
        // if creep is supposed to harvest energy from source
        else {
            // if in target room
            if (creep.room.name == creep.memory.targetRoom) {

            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            //var hostiles = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER});
            //var hostiles = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN});
                if(hostiles.length) {
                    if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(hostiles[0]);
                    }
                }
                else{
                    creep.moveTo(Game.flags.Att);
                }
            }
            // if not in target room
            else {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
        }
    }
};
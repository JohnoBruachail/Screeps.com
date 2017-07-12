module.exports = {

    // a function to run the logic for this role
    run: function(creep) {
        // if creep is attacking but is heavly damaged
        if (creep.memory.defending == true && creep.hits < 300) {
            creep.memory.defending = false;
        }
        // if creep is not attacking but is fully repaired
        else if (creep.memory.defending == false && creep.hits == creep.hitsMax) {
            // switch state
            creep.memory.defending = true;
        }

        if (creep.memory.defending == true) {

            if (creep.room.name == creep.memory.targetRoom) {

                var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

                if(hostiles.length) {

                    if(creep.rangedAttack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                        console.log('Enemy Hostile Spotted, Moving To Engage');
                        creep.moveTo(hostiles[0]);
                    }
                }
                else{
                  creep.moveTo(creep.room.find(FIND_FLAGS, {filter: f => f.color == COLOR_BLUE})[0], {reusePath:25})
                }

            }
            else{
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});

            }
        }
        else {
           creep.retreat();
        }
      }
};

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {

        if(creep.hits == creep.hitsMax){
            if (creep.room.name != creep.memory.targetRoom) {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});
            }
            else{
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    // move towards the controller
                    creep.moveTo(creep.room.controller, {reusePath:25});
                }
            }
        }else{
            creep.retreat();
        }
    }
};

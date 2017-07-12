module.exports = {
    // a function to run the logic for this role
    run: function (creep) {

        if (creep.room.name != creep.memory.targetRoom) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            // move to exit
            creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});
        }
        else{
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller, {reusePath:20});
            }
        }
    }
};

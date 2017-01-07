module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        if(creep.memory.claiming == true && creep.room.name != creep.memory.targetRoom) {
            creep.memory.claiming = false;
            //creep.say('finding room');
        }
        // if creep is not claiming but finds the room
        else if (creep.memory.claiming == false && creep.room.name == creep.memory.targetRoom) {
            // switch state
            creep.memory.claiming = true;
            //creep.say('moving to target');
        }
        if (creep.memory.claiming == true) {
            //creep.moveTo(Game.flags.Att);
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        else {

          creep.moveTo(Game.flags.Att);
            // if (creep.room.name != creep.memory.targetRoom) {
            // // find exit to target room
            // var exit = creep.room.findExitTo(creep.memory.targetRoom);
            // // move to exit
            // creep.moveTo(creep.pos.findClosestByRange(exit));
            // }
        }
    }
};

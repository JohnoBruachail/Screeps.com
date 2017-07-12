module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == false && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = true;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == true && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = false;
        }

        if(creep.hits == creep.hitsMax){
            // if creep is supposed to transfer energy to a structure
            if (creep.memory.working == false) {
                // if in home room
                if (creep.room.name == creep.memory.homeRoom) {
                    //creep.deliverEnergy();

                    // try to upgrade the controller
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        // if not in range, move towards the controller
                        creep.moveTo(creep.room.controller, {reusePath:25});
                    }
                }
                // if not in home room...
                else {
                    // find exit to home room
                    var exit = creep.room.findExitTo(creep.memory.homeRoom);
                    // and move to exit
                    creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});
                }
            }
            // if creep is supposed to harvest energy from source
            else {
                // if in target room
                if (creep.room.name == creep.memory.targetRoom) {
                    // find source
                    creep.getEnergy(false, false, false, true);
                }
                // if not in target room
                else {

                    // find exit to target room

                    //EXPEREMENT ONE- FAIL
                    // var thepath = Game.map.findRoute(creep.room, creep.memory.targetRoom)

                    // var exit = creep.pos.findClosestByRange(thepath[0].exit);
                    // creep.moveTo(exit);

                    //EXPEREMENT TWO
                    var exit = creep.room.findExitTo(creep.memory.targetRoom);
                    // move to exit
                    creep.moveTo(creep.pos.findClosestByPath(exit), {reusePath:25});

                    // var exit = creep.room.findExitTo(creep.memory.targetRoom);
                    // // move to exit
                    // creep.moveTo(creep.pos.findClosestByRange(exit));
                }
            }
        }else{
            creep.retreat();
        }
    }
};

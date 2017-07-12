module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is attacking but is heavly damaged

        if (creep.memory.attacking == true && creep.hits < 1200) {
            creep.memory.attacking = false;
        }
        // if creep is not attacking but is fully repaired
        else if (creep.memory.attacking == false && creep.hits == creep.hitsMax) {
            // switch state
            creep.memory.attacking = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.attacking == true) {

            if (creep.room.name == creep.memory.targetRoom) {

                // var wall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_WALL});
                //
                // if(wall) {
                //     if(creep.attack(wall) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(wall);
                //     }
                // }
            }
            else{
                //creep.moveTo(Game.flags.zombieHealPoint, {reusePath:20});
                //creep.heal(creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(object) {return object.hits < object.hitsMax;}}));
                creep.moveTo(Game.flags.zombieGatherPoint, {reusePath:20});

                //   // find exit to target room
                //   var exit = creep.room.findExitTo(creep.memory.targetRoom);
                //   // move to exit
                //   creep.moveTo(creep.pos.findClosestByPath(exit, {reusePath:25}));
            }

        }
        else{

            // // var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            // //
            // // if(hostiles) {
            //     if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
            //         console.log('bloddy enemy nearby');
            //         creep.moveTo(hostiles[0]);
            //     }
            // }
            // else{
                creep.moveTo(Game.flags.zombieHealPoint, {reusePath:20});
                creep.heal(creep);
            // }
        }
    }
};

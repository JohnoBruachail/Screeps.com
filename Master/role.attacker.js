module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is attacking but is heavly damaged

        //(creep.hitsMax / 2)

        if (creep.memory.attacking == true && creep.hits < 1600) {
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

                var structure = Game.getObjectById('586fe7f8e684603f410530d2')

                // if(structure == null){
                //     structure = Game.getObjectById('586effe5b04dd3de4625a283')
                // }

                //var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: c => c.structureType == STRUCTURE_RAMPART});


                //   if(creep.attack(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)) == ERR_NOT_IN_RANGE) {
                //       creep.moveTo(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS));
                //   }


                if(creep.attack(structure == ERR_NOT_IN_RANGE)) {
                    creep.moveTo(structure);
                }
        }
        else{
              creep.moveTo(Game.flags.attackPoint, {reusePath:20});
        }
    }
    else{

        if (creep.room.name == creep.memory.targetRoom) {
            creep.moveTo(Game.flags.medicCamp, {reusePath:20});
        }
        else{

            creep.moveTo(Game.flags.medicCamp, {reusePath:20});
            // var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            //
            // if(hostiles.length > 0) {
            //     if(creep.attack(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS));
            //     }
            // }
        }
    }
    }
};

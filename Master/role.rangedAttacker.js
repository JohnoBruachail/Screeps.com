module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is attacking but is heavly damaged

        //(creep.hitsMax / 2)

        if (creep.memory.attacking == true && creep.hits < 1500) {
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
                //var hostile = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_RAMPART});
                var hostile = Game.getObjectById('586fe7f8e684603f410530d2')
                // if(structure == null){
                //     var hostile = Game.getObjectById('586effe5b04dd3de4625a283')
                // }

                //creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL && s.structureid == '586e64849409f1025baf6180'});
                creep.moveTo(hostile);

                if(creep.pos.getRangeTo(hostile) <=3){
                        creep.rangedAttack(hostile)
                }
            }
            else{
                var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(hostile != null){

                    creep.moveTo(hostile);
                    if(creep.pos.getRangeTo(hostile) <=3){

                        creep.rangedAttack(hostile)
                    }
                }else{
                    creep.moveTo(Game.flags.attackPoint, {reusePath:20});
                }
            }
        }
        else{
            if (creep.room.name == creep.memory.targetRoom) {
                creep.moveTo(Game.flags.medicCamp, {reusePath:20});
            }
            else{
                var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                //console.log('found one ' + hostile);

                if(creep.pos.getRangeTo(hostile) <=3){
                    if(creep.moveTo(hostile) == ERR_NO_PATH){
                        creep.rangedAttack(hostile)
                    }
                    else if(creep.pos.getRangeTo(hostile) <=2){
                        if(creep.moveTo(hostile) == ERR_NO_PATH){
                            creep.rangedAttack(hostile)
                        }
                        else if(creep.pos.getRangeTo(hostile) <=1){
                                creep.rangedAttack(hostile)
                        }
                    }
                }
                else{
                    creep.moveTo(Game.flags.medicCamp, {reusePath:20});
                }
            }
        }
    }
};

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is attacking but is heavly damaged
        if (creep.memory.healing == true && creep.hits < 1) {
            creep.memory.healing = false;
        }
        // if creep is not attacking but is fully repaired
        else if (creep.memory.healing == false && creep.hits == creep.hitsMax) {
            // switch state
            creep.memory.healing = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.healing == true) {

            if (creep.room.name == creep.memory.targetRoom) {
                if(creep.heal(creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(object) {return object.hits < object.hitsMax; return object.memory.role != 'zombie';}})) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(object) {return object.hits < object.hitsMax; return object.memory.role != 'zombie';}}));
                }
                creep.moveTo(Game.flags.medicCamp, {reusePath:20});
            }
            else {

                //creep.heal(creep)
                if(creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(object) {return object.hits < object.hitsMax; return object.memory.role != 'zombie';}}) != null){
                    if(creep.heal(creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(object) {return object.hits < object.hitsMax; return object.memory.role != 'zombie';}})) == ERR_NOT_IN_RANGE){
                        creep.moveTo(creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: function(object) {return object.hits < object.hitsMax; return object.memory.role != 'zombie';}}));
                    }
                }else{
                    creep.moveTo(Game.flags.medicCamp, {reusePath:20});
                }

            }
        }
        else{
            creep.moveTo(Game.flags.Repair_Station, {reusePath:20});
        }
    }
};

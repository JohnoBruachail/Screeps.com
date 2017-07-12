module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.defending && creep.room.find(FIND_HOSTILE_CREEPS).length == 0) {
            creep.memory.defending = false;
	    }
	    if(!creep.memory.defending && creep.room.find(FIND_HOSTILE_CREEPS).length > 0 ) {
	        creep.memory.defending = true;
	    }

	    if(creep.memory.defending) {

            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

            if(hostiles.length) {
                if(creep.rangedAttack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostiles[0]);
                }
            }
            else {
                creep.moveTo(creep.room.find(FIND_FLAGS, {filter: f => f.color == COLOR_BLUE})[0], {reusePath:25})
            }
	    }
	    else {

	    }
	}
};

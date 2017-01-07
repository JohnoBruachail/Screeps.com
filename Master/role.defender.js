module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.defending && creep.room.find(FIND_HOSTILE_CREEPS).length == 0) {
            creep.memory.defending = false;
            creep.say('moving to flag');
	    }
	    if(!creep.memory.defending && creep.room.find(FIND_HOSTILE_CREEPS).length > 0 ) {
	        creep.memory.defending = true;
	        creep.say('enemy spotted');
	    }

	    if(creep.memory.defending) {

	        var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(hostile > 0) {
                if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostiles[0]);
                }
            }
	    }
	    else {
	       creep.moveTo(Game.flags.Def);
	    }
	}
};

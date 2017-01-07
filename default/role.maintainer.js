var roleMaintainer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('maintaining');
	    }

	    if(creep.memory.building) {
	        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
	            filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
	        });
	        
	        if(target != undefined){
	            if (creep.repair(target) == ERR_NOT_IN_RANGE){
	                creep.moveTo(target)
	            }
	        }
	    }
	    else {
	        var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
	}
};

module.exports = roleMaintainer;
module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is attacking but is heavly damaged
        if (creep.memory.attacking == true && creep.hits < 300) {
            creep.memory.attacking = false;
            //creep.say('retreating');
        }
        // if creep is not attacking but is fully repaired
        else if (creep.memory.attacking == false && creep.hits == creep.hitsMax) {
            // switch state
            creep.memory.attacking = true;
            //creep.say('moving to target');
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.attacking == true) {

          if (creep.room.name == creep.memory.targetRoom) {

              var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
              //var hostiles = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER});
              //var hostiles = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN});
              if(hostiles.length) {
                  if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(hostiles[0]);
                  }
              }
              else{
                  creep.moveTo(Game.flags.Att);
              }
          }
          else {
              // find exit to target room
              var exit = creep.room.findExitTo(creep.memory.targetRoom);
              // move to exit
              creep.moveTo(creep.pos.findClosestByRange(exit));
          }
        }
        else {
              creep.moveTo(Game.flags.Repair_Station);
        }
    }
};

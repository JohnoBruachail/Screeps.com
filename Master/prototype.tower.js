// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        var hostileCreep = this.pos.findClosestByRange(this.pos.findInRange(FIND_HOSTILE_CREEPS, 10));
        //find closest damaged structure
        var damagedStructure = this.pos.findClosestByRange(this.pos.findInRange(FIND_MY_STRUCTURES, 5), {filter: (structure) => structure.hits < structure.hitsMax});
        //find closest damaged friendly creep
        var damagedCreep = this.pos.findClosestByRange(this.pos.findInRange(FIND_MY_CREEPS, 5), {filter: (creep) => creep.hits < creep.hitsMax});
        // if one is found...

          //REDESIGN TO TARGET ONLY COMBAT CAPABLE CREEPS, ENEMYS USE HEALERS TO SOAK DAMAGE AND RUIN ECOMEMY!!!!


        if (hostileCreep != undefined) {
            // attack hostile creep
            this.attack(hostileCreep);
        }
        else if (damagedCreep != undefined){
            //heal damaged friendly creep
            this.heal(damagedCreep);
        }
        else if (damagedStructure != undefined){
            // repair damaged structure
            //this.repair(damagedStructure);
        }

    };

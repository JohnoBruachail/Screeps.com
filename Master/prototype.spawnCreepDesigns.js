// spawn a custom creep
StructureSpawn.prototype.createCustomCreep =
function (energy, homeRoom, targetRoom, role, sourceId) {

    if(role == 'miner'){
        let body = [];
        if(energy >= 550){
            energy = 550;
        }
        do{
            body.push(WORK);
            energy -= 100;
        }while(energy >= 150)

        body.push(MOVE);
        return this.createCreep(body, undefined, { role: role, homeRoom: homeRoom, targetRoom: targetRoom, working: false, sourceId: sourceId });
    }

    //LOOP AND ADD COMPONENTS, CHECK IF OVER ENERGY CAP, IF NOT LOOP AGAIN.

    if(role == 'builder' || role == 'harvester' || role == 'maintainer' || role == 'upgrader' || role == 'outpostBuilder'){
        // create a balanced body as big as possible with the given energy
        if(energy >= 800){energy = 800};

        let numberOfParts = Math.floor(energy / 200);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        let body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        // create creep with the created body and the given role
        return this.createCreep(body, undefined, { role: role, homeRoom: homeRoom, targetRoom: targetRoom, working: false });
    }
};


//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//BASE SPAWNERS


// spawn a claimer
StructureSpawn.prototype.createClaimer =
function (targetRoom) {
    return this.createCreep([CLAIM,MOVE], undefined, { role: 'claimer', homeRoom: homeRoom, targetRoom: targetRoom, });
};

//keep maybe?
StructureSpawn.prototype.createScavenger =
function () {
    return this.createCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined,{ role: 'scavenger', working: false});
};

// spawn a transport
StructureSpawn.prototype.createTransport =
function (energy, homeRoom, role) {
    // create a body with twice as many CARRY as MOVE parts
    var numberOfParts = Math.floor(energy / 150);
    // make sure the creep is not too big (more than 50 parts)
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    var body = [];
    for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }

    return this.createCreep(body, undefined, { role: role, homeRoom: homeRoom, transporting: true, targetContainer: 0 });
};


//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//OUTPOST SPAWNERS


// spawn an outpost harvester
StructureSpawn.prototype.createOutpostHarvester =
function (energy, homeRoom, targetRoom, sourceIndex) {

    // create a balanced body as big as possible with the given energy
    let numberOfParts = Math.floor(energy / 200);
    // make sure the creep is not too big (more than 50 parts)
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    let body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }
    // create creep with the created body
    return this.createCreep(body, undefined, { role: 'outpostHarvester', homeRoom: homeRoom, targetRoom: targetRoom, sourceIndex: sourceIndex, working: false });
};

// spawn an outpost miner
StructureSpawn.prototype.createOutpostMiner =
function (energy, homeRoom, targetRoom) {
    let body = [];
    if(energy >= 650){
        energy = 650;
    }
    do{
        body.push(WORK);
        energy -= 100;
    }while(energy >= 250)

    body.push(MOVE);
    body.push(MOVE);
    body.push(MOVE);
    return this.createCreep(body, undefined, { role: 'outpostMiner', homeRoom: homeRoom, targetRoom: targetRoom, working: false, sourceId: 0 });
};

// spawn an outpost miner
StructureSpawn.prototype.createOutpostReserver =
function (energy, homeRoom, targetRoom) {
    return this.createCreep([CLAIM, MOVE], undefined, { role: 'outpostReserver', homeRoom: homeRoom, targetRoom: targetRoom });
};

// spawn a transport
StructureSpawn.prototype.createOutpostTransport =
function (energy, homeRoom, targetRoom) {
    // create a body with twice as many CARRY as MOVE parts

    // var body = [];
    // body.push(WORK);
    // body.push(WORK);
    // energy -=200;

    var numberOfParts = Math.floor(energy / 150);
    // make sure the creep is not too big (more than 50 parts)
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
    var body = [];
    for (let i = 0; i < numberOfParts * 2; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }

    // create creep with the created body and the role 'transport'
    return this.createCreep(body, undefined, { role: 'outpostTransport', homeRoom: homeRoom, targetRoom: targetRoom, transporting: true, targetContainer: 0 });
};

//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//*********************************************************************************************************************************************************************//
//MILITARY SPAWNERS

// spawn a defender
StructureSpawn.prototype.createDefender =
function (energy, homeRoom) {

  let numberOfToughParts = 0;
  let numberOfMoveParts = 0;
  let numberOfRangedAttackParts = 0;
  let tempEnergy = energy;

  tempEnergy -= 200;

  do{
      if(tempEnergy >= 200){
          numberOfRangedAttackParts += 1;
          numberOfMoveParts += 1;
          tempEnergy -= 200;
      }
      if(tempEnergy >= 60){
          numberOfToughParts += 1;
          numberOfMoveParts += 1;
          tempEnergy -= 60;
      }
  }while(tempEnergy >= 60)

  let body = [];
  for (let i = 0; i < numberOfToughParts; i++) {
      body.push(TOUGH);
  }
  for (let i = 0; i < numberOfMoveParts; i++) {
      body.push(MOVE);
  }
  for (let i = 0; i < numberOfRangedAttackParts; i++) {
      body.push(RANGED_ATTACK);
  }

  body.push(RANGED_ATTACK);
  body.push(MOVE);

  return this.createCreep(body, undefined, {role: 'defender', homeRoom: homeRoom, defending: false});
};


StructureSpawn.prototype.createOutpostDefender =
function (energy, homeRoom, targetRoom) {
    return this.createCreep([TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK,MOVE], undefined, {role: 'outpostDefender', homeRoom: homeRoom, targetRoom: targetRoom, defending: false});
};

// spawn an attacker
StructureSpawn.prototype.createAttacker =
function (energy, homeRoom, targetRoom) {

    let numberOfToughParts = 0;
    let numberOfMoveParts = 0;
    let numberOfAttackParts = 0;
    let tempEnergy = energy;

    tempEnergy -= 130;

    do{
        if(tempEnergy >= 130){
            numberOfAttackParts += 1;
            numberOfMoveParts += 1;
            tempEnergy -= 130;
        }
        if(tempEnergy >= 60){
            numberOfToughParts += 1;
            numberOfMoveParts += 1;
            tempEnergy -= 60;
        }
    }while(tempEnergy >= 60)

    let body = [];
    for (let i = 0; i < numberOfToughParts; i++) {
        body.push(TOUGH);
    }
    for (let i = 0; i < numberOfMoveParts; i++) {
        body.push(MOVE);
    }
    for (let i = 0; i < numberOfAttackParts; i++) {
        body.push(ATTACK);
    }

    body.push(ATTACK);
    body.push(MOVE);

    return this.createCreep(body, undefined, {role: 'attacker', homeRoom: homeRoom, targetRoom: targetRoom, attacking: false});
};

// spawn an attacker
StructureSpawn.prototype.createRangedAttacker =
function (energy, homeRoom, targetRoom) {

    let numberOfToughParts = 0;
    let numberOfMoveParts = 0;
    let numberOfRangedAttackParts = 0;
    let tempEnergy = energy;

    tempEnergy -= 200;

    do{
        if(tempEnergy >= 130){
            numberOfRangedAttackParts += 1;
            numberOfMoveParts += 1;
            tempEnergy -= 200;
        }
        if(tempEnergy >= 60){
            numberOfToughParts += 1;
            numberOfMoveParts += 1;
            tempEnergy -= 60;
        }
    }while(tempEnergy >= 60)

    let body = [];
    for (let i = 0; i < numberOfToughParts; i++) {
        body.push(TOUGH);
    }
    for (let i = 0; i < numberOfMoveParts; i++) {
        body.push(MOVE);
    }
    for (let i = 0; i < numberOfRangedAttackParts; i++) {
        body.push(RANGED_ATTACK);
    }

    body.push(RANGED_ATTACK);
    body.push(MOVE);

    return this.createCreep(body, undefined, {role: 'rangedAttacker', homeRoom: homeRoom, targetRoom: targetRoom, attacking: false});
};

StructureSpawn.prototype.createMedic =
function (energy, homeRoom, targetRoom) {

    // let numberOfMoveParts = 0;
    // let numberOfHealParts = 0
    // let tempEnergy = energy;
    //
    // tempEnergy -= 130;
    //
    // do{
    //     if(tempEnergy >= 300){
    //         numberOfHealParts += 1;
    //         numberOfMoveParts += 1;
    //         tempEnergy -= 300;
    //     }
    //     if(tempEnergy >= 60){
    //         numberOfToughParts += 1;
    //         numberOfMoveParts += 1;
    //         tempEnergy -= 60;
    //     }
    // }while(tempEnergy >= 60)
    //
    // let body = [];
    // for (let i = 0; i < numberOfToughParts; i++) {
    //     body.push(TOUGH);
    // }
    // for (let i = 0; i < numberOfMoveParts; i++) {
    //     body.push(MOVE);
    // }
    // for (let i = 0; i < numberOfHealParts; i++) {
    //     body.push(HEAL);
    // }
    //
    // body.push(ATTACK);
    // body.push(MOVE);

    body = [HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE];

    return this.createCreep(body, undefined, {role: 'medic', homeRoom: homeRoom, targetRoom: targetRoom, healing: false});
};

// spawn an attacker
StructureSpawn.prototype.createZombie =
function (energy, homeRoom, targetRoom) {

    let numberOfToughParts = 0;
    let numberOfMoveParts = 0;
    let numberOfHealParts = 0
    let tempEnergy = energy;

    tempEnergy -= 130;

    do{
        if(tempEnergy >= 300){
            numberOfHealParts += 1;
            numberOfMoveParts += 1;
            tempEnergy -= 300;
        }
        if(tempEnergy >= 60){
            numberOfToughParts += 1;
            numberOfMoveParts += 1;
            tempEnergy -= 60;
        }
    }while(tempEnergy >= 60)

    let body = [];
    for (let i = 0; i < numberOfToughParts; i++) {
        body.push(TOUGH);
    }
    for (let i = 0; i < numberOfMoveParts; i++) {
        body.push(MOVE);
    }
    for (let i = 0; i < numberOfHealParts; i++) {
        body.push(HEAL);
    }

    body.push(ATTACK);
    body.push(MOVE);

    return this.createCreep(body, undefined, {role: 'zombie', homeRoom: homeRoom, targetRoom: targetRoom, attacking: false});
};

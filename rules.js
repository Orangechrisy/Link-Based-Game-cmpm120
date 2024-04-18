class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // done: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // done: replace this text by the initial location of the story
    }
}

let globals = {
    gotCan: false,
    guardsLeft: false,
    talkToCoworker: false,
    gotArm: false
};

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if(locationData.Choices.length > 0) {
            for(let choice of locationData.Choices) {
                if(choice.Lock) {
                    if(globals[choice.Lock] == false) {
                        continue;
                    }
                }
                this.engine.addChoice(choice.Text, choice, locationData.Choices);

            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice, choiceList) {
        if(choice) {
            if(choice.Target) {
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
            else {
                this.engine.show(choice.FurtherText);
                if(choice.Unlock) {
                    console.log(globals[choice.Unlock]);
                    globals[choice.Unlock] = true;
                    console.log(globals[choice.Unlock]);
                }
                for(let choice2 of choiceList) { // loop over the location's Choices
                    if(choice2.Lock) {
                        if(globals[choice2.Lock] == false) {
                            continue;
                        }
                    }
                    if(choice2.FurtherText){
                        continue;
                    }
                    this.engine.addChoice(choice2.Text, choice2, choiceList);    
                }
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
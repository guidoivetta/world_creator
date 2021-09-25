class Item {

    constructor(properties, material) {
        this.properties = properties;
        this.material = material;
        this.name = 'noname';
        this.isEquippable = false;
    }

}

class Equipment extends Item {

    constructor(properties,material) {
        super(properties,material);
        this.isEquippable = true;
    }

}

class Tool extends Equipment {

    constructor(properties, material, tool) {
        super(properties,material);
        this.tool = tool;
        this.name = properties+' '+material+' '+tool;
    }

}
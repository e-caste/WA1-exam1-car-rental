class Car {
    constructor(
        id,
        category,
        brand,
        model,
        description,
        kilometers,
        year,
        fuel,
        value,
        kmperlitre,
        passengers,
        stickshift
    ) {
        // NOT NULL properties
        this.id = id;
        this.category = category;
        this.brand = brand;
        this.model = model;
        // properties that can be NULL
        // if accessed and NULL, in JS they are undefined and don't throw any exception
        if (description) this.description = description;
        if (kilometers) this.kilometers = kilometers;
        if (year) this.year = year;
        if (fuel) this.fuel = fuel;
        if (value) this.value = value;
        if (kmperlitre) this.kmperlitre = kmperlitre;
        if (passengers) this.passengers = passengers;
        if (stickshift) this.stickshift = stickshift;
    }

    static from(json) {
        return  Object.assign(new Car(), json);
    }
}

export default Car;
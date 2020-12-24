
const schema = mongoose.Schema({
    name: String
});

schema.methods.meow = function() {
    console.log(this.get('name'));
};

const Cat = mongoose.model('Cat', schema);

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(record =>{ console.log(record.meow()); });
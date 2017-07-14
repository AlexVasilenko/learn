class MyVueComponent {
    constructor(values) {
      this.render = values.render;
      this.data = values.data();
      this._data = {};
      this.checkReactivity(this.data);
    }

    checkReactivity(data) {
        const allKeys = Object.keys(data);
        
        for (let name of allKeys) {
            this.setFunctions(data, name, data[name]);
            if (this.isObject(data[name])) {
                this.checkReactivity(data[name]);
            }
        }
    }

    isObject(obj) {
        return typeof obj === 'object' && !obj.push;
    }

    setFunctions (object, name, value) {
        this._data[name] = value;
        Object.defineProperty(object, name, {
            enumerable: true,
            configurable: true,
            set: (value) => {
                this._data[name] = value;
                if (this.isObject(value)) {
                  this.setFunctions(this.data, name, value);
                  this.checkReactivity(value);
                }
                this.render(this._data);
            },
            get: () => this._data[name],
        });
    }
}

var newComponent = new MyVueComponent({
    data: () => ({
        value: 'some'
    }),
    render: (data) => {
        console.log(data.value);
    }
});

class MyVueComponent {
    constructor(values) {
      this.render = values.render;
      this.data = values.data();
      this.computed = values.computed;
      this._data = {};
      this._registerGetters = [];
      this._computedProperties = {};
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

        this.createComputed(this.computed);
    }

    createComputed(computed) {
        for (const fnName of Object.keys(computed)) {
            if (Object.keys(this.data).includes(fnName)) {
                console.error(`This ${fnName} is using in data`);
            }
            this._registerGetters.length = 0;
            const result = computed[fnName].call(this);
            this._computedProperties[fnName] = {};
            if (this._registerGetters.length) {
              this._computedProperties[fnName].fields = [...this._registerGetters];
            }
            this._computedProperties[fnName].value = result;
            this._computedProperties[fnName].fn = computed[fnName];
            Object.defineProperty(this.computed, fnName, {
                get: () => {
                    return this._computedProperties[fnName].value;
                },
                set: (value) => {

                }
            })
        }
    }

    isObject(obj) {
        return typeof obj === 'object' && !obj.push;
    }

    _checkInComputed(obj, name) {
        for (const fnName of Object.keys(this._computedProperties)) {
            const currentItems = this._computedProperties[fnName].fields;
            const find = currentItems.find(item => item.obj === obj && item.name === name);

            if (find) {
                const result = this._computedProperties[fnName].fn.call(this);
                this._computedProperties[fnName].value = result;
                this.render(this.data);
            }

        }
    }

    setFunctions (object, name, value) {
        this._data[name] = value;
        var descriptor = Object.getOwnPropertyDescriptor(object, name);
        const self = this;
        Object.defineProperty(object, name, {
            enumerable: true,
            configurable: true,
            set: (value) => {
                this._data[name] = value;
                if (this.isObject(value)) {
                  this.setFunctions(this.data, name, value);
                  this.checkReactivity(value);
                }
                if (descriptor.set) {
                    descriptor.set(value);
                }
                this._checkInComputed(this._data, name);
                this.render(this._data);
            },
            get: () => {
                if (descriptor.get) {
                    descriptor.get();
                }
                self._registerGetters.push({ name, obj: this._data});
                return this._data[name];
            },
        });
    }
}

var newComponent = new MyVueComponent({
    data: () => ({
        value: 'some'
    }),
    computed: {
        reverse: function () {
            console.log('render');
            return this.data.value;
        }
    },
    render: (data) => {
        console.log(data.value);
    }
});

setTimeout(() => {
    newComponent.data.value = 'some 5';
}, 3000);
newComponent.data.value = 'some3';

let wrapper = function(Component) {
    function setAnimationClass(element, animationClass) {
        element.classList.remove(animationClass);
        setTimeout(() => {
            element.classList.add(animationClass);
        }, 0);
    }

    function callComponentDidUpdate(superFunction) {
        if (superFunction) {
            superFunction();
        }
    }

    if (!Component.render || !Component.prototype.render) {

        return class extends React.Component {
        componentDidUpdate() {
            setAnimationClass(this.wrapperElement, 'flash');
            let superFn = super.componentDidUpdate;
            callComponentDidUpdate(superFn);
        }

        render() {
            return (<div className="animated flash" ref={(wrapper) => { this.wrapperElement = wrapper; }}>
                       {Component(this.props, this.context)}
                   </div>);
            }
        }
    }

    return class extends Component {
        componentDidUpdate() {
            setAnimationClass(this.wrapperElement, 'flash');
            let superFn = super.componentDidUpdate;
            callComponentDidUpdate(superFn);
        }

        render() {
            return (<div className="animated flash" ref={(wrapper) => { this.wrapperElement = wrapper; }}>
                {super.render()}
            </div>);
        }
    }
}
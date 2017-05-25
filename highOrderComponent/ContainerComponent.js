let Wrapped = wrapper(pureComponent);


class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            name: 'alex',
        };
    }
    componentDidMount() {
        setInterval(() => {
        this.setState({
            name: Math.random(),
        });
    }, 2000);
    }
    render() {
        return <Wrapped name={this.state.name} />;
    }
}

ReactDOM.render(
    <Container />,
    document.getElementById('app')
);
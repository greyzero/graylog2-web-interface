'use strict';

var React = require('react');

var Input = require('react-bootstrap').Input;

var DataFilter = React.createClass({
    getInitialState() {
        return {
            data: this.props.data,
            filterKeys: this.props.filterKeys,
            filter: ""
        };
    },
    componentWillReceiveProps(newProps) {
        if (this.state.data === newProps.data) {
            return;
        }

        this.setState({
            data: newProps.data,
            filterKeys: newProps.filterKeys
        }, this.filterData);
    },
    onFilterUpdate(event) {
        this.setState({filter: event.target.value}, this.filterData);
    },
    filterData() {
        var filteredData = this.state.data.filter((datum) => {
            return this.state.filterKeys.some((filterKey) => {
                return datum[filterKey].toLocaleLowerCase().indexOf(this.state.filter.toLocaleLowerCase()) !== -1;
            });
        });

        this.props.onFilterUpdate(filteredData);
    },
    render() {
        return (
            <form className="form-inline">
                <Input type="text"
                       groupClassName="form-group-sm"
                       label={this.props.label}
                       name="filter"
                       value={this.state.filter}
                       onChange={this.onFilterUpdate}/>
            </form>
        );
    }
});

module.exports = DataFilter;
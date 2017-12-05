import React, { Component } from 'react';
import _ from 'lodash';

class SortableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderBy: null,
      orderAsc: false,
      activeFilters: [],
    };
  }

  handleHeaderClick(index) {
    const { orderBy, orderAsc } = this.state;

    this.setState({
      orderBy: index,
      orderAsc: (orderBy === index) ? !orderAsc : orderAsc
    });
  }

  containsImageUrl(str) {
    return (
      str.match(/\.(jpeg|jpg|gif|png|bmp)/) !== null
    );
  }

  columnItem(obj, param, index) {
    const isImg = this.containsImageUrl(obj[param]);
    const displayEl = isImg ? <img src={ obj[param] }
                                   alt="thumbnail"
                                   className="thumbnail_img" /> :
                              obj[param];

    return (
      <td key={`${param} - ${index}`}>
        { displayEl }
      </td>
    )
  }

  buildButton(classes, display_txt, clickFn) {
    return (
      <div className={ classes }
           onClick={ () => clickFn() }>
        { display_txt }
      </div>
    )
  }

  handleFilterChange(dataParam, evt) {
    const { activeFilters } = this.state;
    const filterObj = { dataParam,
                        value: evt.target.value };

    const isRemoveable = evt.target.value === "";

    const activeFiltersWithoutPreviousFilter = _.filter(activeFilters, (obj) => obj.dataParam !== dataParam);
    const updatedActiveFilters = !isRemoveable ? activeFiltersWithoutPreviousFilter.concat(filterObj) :
                                                 activeFiltersWithoutPreviousFilter;

    this.setState({ activeFilters: updatedActiveFilters });
  }

  // move to utils
  recursiveFilterByActiveFilters(data, filters) {
    let filteredByParam = data;
    filters.map( (filterObj) => {
      filteredByParam = filteredByParam.filter( datum => { 
        return datum[filterObj.dataParam] === filterObj.value;
      })
      return true;
    })

    return filteredByParam;
  }

  buildFilterHeader(data, dataParam, displayText) {
    const rawDataForSelectOptions = _.uniqBy(data, dataParam);
    const rawArrayForSelectOptions = rawDataForSelectOptions.map(datum => datum[dataParam]);
    const sortedArrayForSelectOptions = rawArrayForSelectOptions.sort();
    const filterDefaultOptionEl = <option value="">{ displayText }</option>;
    const filterOptionsEls = sortedArrayForSelectOptions.map( (value, index) => {
      return (
        <option value={ value }
                key={ index } >
          { value }
        </option>
      )
    });

    return (
      <select id={ dataParam }
              onChange={ this.handleFilterChange.bind(this, dataParam) }>
        { filterDefaultOptionEl }
        { filterOptionsEls }
      </select>
    ); 
  }
  // TODO: support for reps...

  // Nice to haves:
  // Searhable filter (1hour)
  // Redux (approx: 1hour)
  // Styling (approx: 30mins)

  // change displayText to displayText

  // import getTopicCard from '../components/Topic/Cards';
  render() {
    const {
      orderBy,
      orderAsc,
      activeFilters,
    } = this.state;

    const {
      tableConfig: {
        caption,
        data,
        config: {
          headers,
        },
      },
    } = this.props;

    const headerDataOrderedBySortID = _.sortBy(headers, [(i) => { return i.sortID }]);
    const tableHeadersArr = _.map(headerDataOrderedBySortID, 'dataParam');

    const headersEls = headerDataOrderedBySortID.map( ({ sortID, displayText, dataParam, sortable, filterable, filterConfig }, index ) => {
      // const filterType = _.get(filterConfig, 'filterType', '');
      const isSelected = (index === orderBy);
      const arrow = (isSelected ? (orderAsc ? 'is--asc' : 'is--desc') : "");
      const sortableClass = sortable ? 'sortable' : '';
      const headerClasses = `header ${isSelected ? ` is--active ${ arrow } ${ sortableClass }` : `${ sortableClass }`}`;
      const filterHeaderEl = filterable ? this.buildFilterHeader(data, dataParam, displayText) : 
                                          null;
      return (
        <th className={ headerClasses } 
            key={ sortID }
            onClick={ sortable ? this.handleHeaderClick.bind(this, index) : null} >
          { filterable ? filterHeaderEl : displayText }
        </th>
      );
    });

    const isFilterActive = activeFilters.length > 0;
    const sortedRowData = orderAsc ? _.sortBy(data, [(d) => { return d[tableHeadersArr[orderBy]]}]) :
                                     _.sortBy(data, [(d) => { return d[tableHeadersArr[orderBy]]}]).reverse();
    const filteredRowData = isFilterActive ? this.recursiveFilterByActiveFilters(sortedRowData, activeFilters) :
                                             sortedRowData;

    const rowsEls = filteredRowData.map((obj, index) => {
      const columns = tableHeadersArr.map((param, i) => this.columnItem(obj, param, index))

      return (
        <tr key={ index }>
          { columns }
        </tr>
      );
    });

    const captionEl = caption ? <caption>{ caption }</caption> : 
                                null;
    const headerEl = <thead><tr>{ headersEls }</tr></thead>;
    const rowsEl = <tbody>{ rowsEls }</tbody>;

    return (
      <div className="table_container">
        <table>
          { captionEl }
          { headerEl }
          { rowsEl }
        </table>
      </div>
    )
  }
}

export default SortableTable;
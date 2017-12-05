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
    return str.match(/\.(jpeg|jpg|gif|png|bmp)/) !== null;
  }

  columnItem(obj, param, keyStr = '') {
    const isImg = this.containsImageUrl(obj[param]);
    const displayEl = isImg ? <img src={ obj[param] }
                                   alt="thumbnail"
                                   className="thumbnail_img"
                                   key={ keyStr ? keyStr : null} /> :
                              obj[param];
    return displayEl;
  }

  columnItems(obj, param, headerConfig, index) {
    const columnItems = obj[param].map((item, i) => {
                          const keyStr = `${ headerConfig.objectConfig.dataParam } - ${ i }`; 
                          return this.columnItem(item, headerConfig.objectConfig.dataParam, keyStr);
                        });
    return columnItems;
  }
  
  buildColumnItem(obj, param, index, headerConfig) {
    const isArray = _.get(headerConfig, 'isObject', false);;
    const columnItem = isArray ? this.columnItems(obj, param, headerConfig, index) :
                                 this.columnItem(obj, param);
    return (
      <td key={`${param} - ${index}`}>
        { columnItem } 
      </td>
    )
  }

  buildRowEls(filteredRowData, tableHeadersArr, tableHeaderConfigOrdered) {
    return filteredRowData.map((obj, index) => {
      const columns = tableHeadersArr.map((param, i) => this.buildColumnItem(obj, param, index, tableHeaderConfigOrdered[i]));

      return (
        <tr key={ index }>
          { columns }
        </tr>
      );
    });
  };

  // move to utils
  buildButton(classes, display_txt, clickFn) {
    return (
      <div className={ classes }
           onClick={ () => clickFn() }>
        { display_txt }
      </div>
    )
  }

  handleFilterChange(dataParam, filterType, tableHeaderConfig = {}, evt) {
    const { activeFilters } = this.state;
    const filterParam = tableHeaderConfig.isObject ? tableHeaderConfig.filterConfig.filterParam :
                                                     null;
    const filterObj = { dataParam,
                        filterParam,
                        isObject: _.get(tableHeaderConfig, "isObject", false),
                        value: evt.target.value };

    const isRemoveable = evt.target.value === "";
    const activeFiltersWithoutPreviousFilter = _.filter(activeFilters, (obj) => obj.dataParam !== dataParam);
    const updatedActiveFilters = !isRemoveable ? activeFiltersWithoutPreviousFilter.concat(filterObj) :
                                                 activeFiltersWithoutPreviousFilter;

    this.setState({ activeFilters: updatedActiveFilters });
  }

  // move to utils
  recursiveFilterByActiveFilters(data, filters) {
    let dataFilteredByParam = data;
    filters.map( ({ dataParam, value, isObject, filterParam }) => {
      dataFilteredByParam = isObject ? dataFilteredByParam.filter((rowData) => {
                                                                    return rowData[dataParam].some((subData) => {
                                                                      return subData[filterParam] === value;
                                                                    })
                                                                  })
                                        :
                                        dataFilteredByParam.filter( datum => { 
                                          return datum[dataParam] === value;
                                        });
      return true;
    })

    return dataFilteredByParam;
  }

  buildFilterOptionsFromFlatData(arr) {
    return arr.map( (value, index) => {
      return (
        <option value={ value }
                key={ index } >
          { value }
        </option>
      )
    });
  }

  buildFilterOptionsFromNestedData(data, headerConfig) {
    const { 
            filterConfig: { 
              filterParam, 
            },
          } = headerConfig;

    const flattenedData = [].concat.apply([], data);
    const uniqueFlattenedData = _.uniqBy(flattenedData, filterParam);
    const rawArrayForSelectOptions = uniqueFlattenedData.map(datum => datum[filterParam]);
    const sortedArrayForSelectOptions = rawArrayForSelectOptions.sort();

    return this.buildFilterOptionsFromFlatData(sortedArrayForSelectOptions);
  }

  buildFilterHeader(data, dataParam, headerText, filterType, tableHeaderConfig) {
    const rawDataForSelectOptions = _.uniqBy(data, dataParam);
    const rawArrayForSelectOptions = rawDataForSelectOptions.map(datum => datum[dataParam]);
    const sortedArrayForSelectOptions = rawArrayForSelectOptions.sort();
    const filterDefaultOptionEl = <option value="">{ headerText }</option>;
    
    // TODO: expand + generalize to support other types of filtering
    const filterOptionsEls = filterType === 'auto' ? this.buildFilterOptionsFromFlatData(sortedArrayForSelectOptions) :
                                                     this.buildFilterOptionsFromNestedData(sortedArrayForSelectOptions, tableHeaderConfig);
    const handleFn = this.handleFilterChange.bind(this, dataParam, filterType, tableHeaderConfig);
    return (
      <select id={ dataParam }
              onChange={ handleFn }>
        { filterDefaultOptionEl }
        { filterOptionsEls }
      </select>
    ); 
  }

  // Nice to haves:
  // Searchable filter (1hour)
  // Redux (approx: 30mins - 1hour)
  // Styling (approx: 30mins)
  render() {
    const {
      orderBy,
      orderAsc,
      activeFilters,
    } = this.state;

    const {
      tableConfig: {
        caption,
        config: {
          headers,
        },
      },
      data
    } = this.props;

    const tableHeaderConfigOrdered = _.sortBy(headers, [(i) => { return i.headerOrder }]);
    const tableHeadersArr = _.map(tableHeaderConfigOrdered, 'dataParam');

    const headersEls = tableHeaderConfigOrdered.map( ({ headerOrder, headerText, dataParam, sortable, filterable, filterConfig }, index ) => {
      const filterType = _.get(filterConfig, 'filterType', '');
      const isSelected = (index === orderBy);
      const arrow = (isSelected ? (orderAsc ? 'is--asc' : 'is--desc') : "");
      const sortableClass = sortable ? 'sortable' : '';
      const headerClasses = `header ${isSelected ? ` is--active ${ arrow } ${ sortableClass }` : `${ sortableClass }`}`;
      const filterHeaderEl = filterable ? this.buildFilterHeader(data, dataParam, headerText, filterType, tableHeaderConfigOrdered[index]) : 
                                          null;
      return (
        <th className={ headerClasses } 
            key={ headerOrder }
            onClick={ sortable ? this.handleHeaderClick.bind(this, index) : null} >
          { filterable ? filterHeaderEl : headerText }
        </th>
      );
    });

    const isFilterActive = activeFilters.length > 0;
    const sortedRowData = orderAsc ? _.sortBy(data, [(d) => { return d[tableHeadersArr[orderBy]]}]) :
                                     _.sortBy(data, [(d) => { return d[tableHeadersArr[orderBy]]}]).reverse();
    const filteredRowData = isFilterActive ? this.recursiveFilterByActiveFilters(sortedRowData, activeFilters) :
                                             sortedRowData;
    const rowsEls = this.buildRowEls(filteredRowData, tableHeadersArr, tableHeaderConfigOrdered);

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
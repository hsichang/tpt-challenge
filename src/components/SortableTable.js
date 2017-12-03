import React, { Component } from 'react';
import _ from 'lodash';

class SortableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderBy: null,
      orderAsc: false,
      currentPage: 0,
      itemsPerPage: this.props.tableConfig.config.itemsPerPage
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

    if (isImg) {
      return (
        <td key={`${param} - ${index}`}>
          <img src={ obj[param] }
               alt="thumbnail"
               className="thumbnail_img" />
        </td>
      )
    } else {
      return (
        <td key={`${param} - ${index}`}>
          { obj[param] }
        </td>
      )
    }
  }

  paginateData(arr) {
    const { itemsPerPage, currentPage } = this.state;
    return arr.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  }

  getLastPage(data) {
    const { itemsPerPage } = this.state;
    return data.length / itemsPerPage;
  }

  buildButton(classes, display_txt, clickFn) {
    return (
      <div className={ classes }
           onClick={ () => clickFn() }>
        { display_txt }
      </div>
    )
  }

  handlePaginationClick(delta) {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + delta});
  }

  render() {
    const {
      orderBy,
      orderAsc,
      currentPage,
    } = this.state;

    const {
      tableConfig: {
        caption,
        data,
        config: {
          headers,
          itemsPerPage,
        },
      },
    } = this.props;

    const headerDataOrderedBySortID = _.sortBy(headers, [(i) => { return i.sortID }]);
    const filteredTableDataByHeaders = _.map(headerDataOrderedBySortID, 'dataParam');

    const headersEls = headerDataOrderedBySortID.map( ({ sortID, title, sortable }, index ) => {
      const isSelected = (index === orderBy);
      const arrow = (isSelected ? (orderAsc ? 'is--asc' : 'is--desc') : "");
      const sortableClass = sortable ? 'sortable' : '';
      const headerClasses = `header ${isSelected ? ` is--active ${arrow} ${ sortableClass }` : `${ sortableClass }`}`;

      return (
        <th className={ headerClasses } 
            key={ sortID }
            onClick={ sortable ? this.handleHeaderClick.bind(this, index) : null}
            >
          { title }
        </th>
      );
    });

    const unpaginatedSortedRowData = orderAsc ? _.sortBy(data, [(i) => { return i[filteredTableDataByHeaders[orderBy]]}]) :
                                                _.sortBy(data, [(i) => { return i[filteredTableDataByHeaders[orderBy]]}]).reverse();
    const isTablePaginated = (itemsPerPage > 0);
    const sortedRowData = isTablePaginated ? this.paginateData(unpaginatedSortedRowData) :
                                             unpaginatedSortedRowData;

    const rowsEls = sortedRowData.map((obj, index) => {
      const columns = filteredTableDataByHeaders.map( (param, _) => {
        return (
          this.columnItem(obj, param, index)
        )
      })

      return (
        <tr key={ index }>
          { columns }
        </tr>
      );
    });

    const onFirstPage = currentPage === 0;
    const onLastPage = currentPage + 1 === this.getLastPage(unpaginatedSortedRowData);

    const paginationControlsEl = 
      ( <div className="controls_container">
          <div className="toggle_btn_container">
            { !onFirstPage && this.buildButton("btn", "prev", this.handlePaginationClick.bind(this, -1)) }
          </div>
          <div className="display_btn_container">
            { currentPage + 1 }
          </div>          
          <div className="toggle_btn_container">
            { !onLastPage && this.buildButton("btn", "next", this.handlePaginationClick.bind(this, 1)) }
          </div>
        </div>
      );

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
        { isTablePaginated && paginationControlsEl }
      </div>
    )
  }
}

export default SortableTable;
import React, { Component } from 'react';
import SortableTable from '../components/SortableTable';
import Data from '../data/data.json';

class App extends Component {
  render() {
    const data = Data;
    const tableConfig = { 
      caption: "Example Table with Optional Sortable Headers",
      config: {
        headers: [
        /*  
          {
            dataParam: Str - corresponding name of the param in the data obj,
            headerText: Str - display text in the header for the column,
            sortable: Boolean - allow sorting on column data,
            filterable: Boolean - allow filtering,
            isObject: Boolean - if object, then table will produce multiple pieces of data in the table cell
            objectConfig: {
              dataParam: Str - corresponding to the name of the param in the nested data object for display
            },
            filterConfig: {
              filterType: Str - "auto" - pick filter values from data in dataParam
                              - "param" - pick filter values from data in filterParam
              filterParam: Str - corresponding name of the param to filter by, only used if filterType is set to "param"
            }
          }
        */
          {
            dataParam: "thumbnail",
            headerText: "",
            sortable: false,
            filterable: false,
          },
          {
            dataParam: "name",
            headerText: "Name",
            sortable: true,
            filterable: false,
          },
          {
            dataParam: "sport",
            headerText: "Sport",
            sortable: false,
            filterable: true,
            filterConfig: {
              filterType: "auto",
            },
          },
          {
            dataParam: "country",
            headerText: "Country",
            sortable: false,
            filterable: true,
            filterConfig: {
              filterType: "auto",
            },
          },
          {
            dataParam: "reps",
            headerText: "Reps",
            sortable: false,
            filterable: true,
            isObject: true,
            objectConfig: {
              dataParam: "thumbnail",
            },
            filterConfig: {
              filterType: "param",
              filterParam: "name",
            },
          },
          {
            dataParam: "status",
            headerText: "Status",
            sortable: false,
            filterable: true,
            filterConfig: {
              filterType: "auto",
            },
          },
        ],
      },
    };

    return (
      <div className="App">
        <SortableTable {... { tableConfig, data }} />
      </div>
    );
  }
}

export default App;

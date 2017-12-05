import React, { Component } from 'react';
import SortableTable from '../components/SortableTable';
import Data from '../data/data.json';

class App extends Component {
  render() {
    // TODO: decouple Data from tableConfig
    // TODO: change name of sortID to something like header order
    const tableConfig = { caption: "Example Table with Optional Sortable Headers",
                          config: {
                            headers: [
                              // {
                              //  sortID: Int - order that the column will appear in the table starting from 0
                              //  dataParam: Str - corresponding name of the param in the data obj,
                              //  displayText: Str - display in the header for the column,
                              //  sortable: Boolean - allow sorting on column data,
                              //  filterable: Boolean - allow filtering
                              //  filterConfig: {
                              //                  filterType: Str - "auto" - pick filters from data
                              //                  filterParam: Str - corresponding to the   
                              //                }
                              // }
                              {
                                sortID: 0,
                                dataParam: "thumbnail",
                                displayText: "",
                                sortable: false,
                                filterable: false,
                              },
                              {
                                sortID: 1,
                                dataParam: "name",
                                displayText: "Name",
                                sortable: true,
                                filterable: false,
                              },
                              {
                                sortID: 2,
                                dataParam: "sport",
                                displayText: "Sport",
                                sortable: false,
                                filterable: true,
                                filterConfig: {
                                                filterType: "auto",
                                              },
                              },
                              {
                                sortID: 3,
                                dataParam: "country",
                                displayText: "Country",
                                sortable: false,
                                filterable: true,
                                filterConfig: {
                                                filterType: "auto",
                                              },
                              },
                              // {
                              //   sortID: 4,
                              //   dataParam: "reps",
                              //   displayText: "Status",
                              //   sortable: false,
                              //   filterable: true,
                              //   filterConfig: {
                              //                   filterType: "param",
                              //                   filterParam: "name",
                              //                 },
                              // },
                              {
                                sortID: 4,
                                dataParam: "status",
                                displayText: "Status",
                                sortable: false,
                                filterable: true,
                                filterConfig: {
                                                filterType: "auto",
                                              },
                              },
                            ],
                          },
                          data: Data,
                        };

    return (
      <div className="App">
        <SortableTable {... { tableConfig }} />
      </div>
    );
  }
}

export default App;

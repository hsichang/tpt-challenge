import React, { Component } from 'react';
import SortableTable from '../components/SortableTable';
import Data from '../data/data.json';

class App extends Component {
  render() {
    const data = Data;
    const tableConfig = { caption: "Example Table with Optional Sortable Headers",
                          config: {
                            headers: [
                              // {
                              //  headerOrder: Int - order that the column will appear in the table starting from 0
                              //  dataParam: Str - corresponding name of the param in the data obj,
                              //  headerText: Str - display in the header for the column,
                              //  sortable: Boolean - allow sorting on column data,
                              //  filterable: Boolean - allow filtering
                              //  filterConfig: {
                              //                  filterType: Str - "auto" - pick filters from data
                              //                  filterParam: Str - corresponding to the   
                              //                }
                              // }
                              {
                                headerOrder: 0,
                                dataParam: "thumbnail",
                                headerText: "",
                                sortable: false,
                                filterable: false,
                              },
                              {
                                headerOrder: 1,
                                dataParam: "name",
                                headerText: "Name",
                                sortable: true,
                                filterable: false,
                              },
                              {
                                headerOrder: 2,
                                dataParam: "sport",
                                headerText: "Sport",
                                sortable: false,
                                filterable: true,
                                filterConfig: {
                                  filterType: "auto",
                                },
                              },
                              {
                                headerOrder: 3,
                                dataParam: "country",
                                headerText: "Country",
                                sortable: false,
                                filterable: true,
                                filterConfig: {
                                  filterType: "auto",
                                },
                              },
                              {
                                headerOrder: 4,
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
                                headerOrder: 5,
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

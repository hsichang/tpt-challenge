import React, { Component } from 'react';
import SortableTable from '../components/SortableTable';
import Data from '../data/data.json';

class App extends Component {
  render() {
    // change dataParam to dataParam or something.
    const tableConfig = { caption: "Example Table with Optional Sortable Headers",
                          config: {
                            itemsPerPage: 5, // Int - if present && gt 0, turns on pagination
                            headers: [
                              // {
                              //  sortID: Int - order that the column will appear in the table starting from 0
                              //  dataParam: Str - corresponding name of the param in the data obj,
                              //  title: Str - display in the header for the column,
                              //  sortable: Boolean - allow sorting on column data
                              // }
                              {
                                sortID: 0,
                                dataParam: "thumbnail",
                                title: "",
                                sortable: false,
                              },
                              {
                                sortID: 1,
                                dataParam: "first_name",
                                title: "First Name",
                                sortable: true,
                              },
                              {
                                sortID: 2,
                                dataParam: "last_name",
                                title: "Last Name",
                                sortable: true,
                              },
                              {
                                sortID: 3,
                                dataParam: "phone",
                                title: "Phone",
                                sortable: true,
                              },
                              // {
                              //   sortID: 4,
                              //   dataParam: "email",
                              //   title: "E-Mail",
                              //   sortable: true,
                              // },
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

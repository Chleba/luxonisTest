import React from 'react';
import DataTable  from './DataTable';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

const App: React.FC = () => {
  return (
    <div className="mainApp">
      <DataTable />
    </div>
  );
};

export default App;

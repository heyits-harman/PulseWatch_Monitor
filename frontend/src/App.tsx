import AddURLForm from './components/AddURLForm';
import StatusGrid from './components/StatusGrid';
import { useState } from 'react';

function App(){
  const [refresh, setRefresh] = useState(0);

  return(
    <div>
      <h1>Uptime Monitor</h1>
      <AddURLForm onSuccess={() => setRefresh(refresh + 1)}/>
      <StatusGrid key={refresh}/>
    </div>
  );
}

export default App;
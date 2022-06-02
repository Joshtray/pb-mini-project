import './App.css';
import Box from './components/Box.js';
import { useEffect, useState } from 'react';
import Compare from './components/Compare';

function App() {
  const [boxList, setBoxList] = useState({1: "200", 2: "200", 3: "200"})
  const [showAdd, setShowAdd] = useState(true)
  const [selected, setSelected] = useState({})
  const [compareEnabled, setCompareEnabled] = useState(false)
  const [comparing, setComparing] = useState(false)
  useEffect(() => {
    if (Object.keys(selected).length >= 2) {
      setCompareEnabled(true)
    }
    else {
      setCompareEnabled(false)
    }
  }, [selected])
  
  return (
    <div className="App">
      <section className='boxes'>
        {Object.keys(boxList).map((i) => {
          return (<Box key={i} index={i} data={boxList[i]} selected = {selected} setSelected = {setSelected} />)
        })}
      </section>
      <section className='compare-section'><button className={`compare ${compareEnabled? "visible": ""}`} onClick={() => {
        compareEnabled && setComparing(true)
        }}>Compare</button></section>
      {comparing && <Compare selected={selected} setComparing={setComparing} />}
    </div>
  );
}

export default App;

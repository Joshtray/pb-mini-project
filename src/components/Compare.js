import React, { useState, useEffect } from 'react'
import Box from './Box.js'
import './Compare.css'

const Compare = ({ selected, setSelected, setComparing }) => {
  const [selObj, setSelObj] = useState({})
  const [closeCompare, setCloseCompare] = useState(false)

  var mouseDownPos = null
  var initTop = null
  const handleMouseDown = (event) => {
    if (event.target.classList.contains("checked-box")) {
      mouseDownPos = event.target.parentElement.children[0]
      mouseDownPos.style.position = "fixed"
      mouseDownPos.style.zIndex = 2
      initTop = mouseDownPos.parentElement.getBoundingClientRect().y 
        + mouseDownPos.parentElement.getBoundingClientRect().height
        - mouseDownPos.getBoundingClientRect().height
      mouseDownPos.style.top = event.clientY - mouseDownPos.getBoundingClientRect().height/2 + "px";
      mouseDownPos.style.left = event.clientX - mouseDownPos.getBoundingClientRect().width/2 + "px";
    }
    window.addEventListener("mousemove", handleDrag)
  }
  const handleDrag = (event) => {
    if (mouseDownPos) {
      mouseDownPos.style.top = event.clientY - mouseDownPos.getBoundingClientRect().height/2 + "px"
      mouseDownPos.style.left = event.clientX - mouseDownPos.getBoundingClientRect().width/2 + "px";
    }
  }
  const handleMouseUp = (event) => {
    window.removeEventListener("mousemove", handleDrag)
    if (event.target.classList.contains("checked-box") && mouseDownPos) {
      var newGCS = event.target.parentElement.style.gridColumn.split(' / ')[0]
      var initGCS = mouseDownPos.parentElement.style.gridColumn.split(' / ')[0]

      var initLeft = mouseDownPos.parentElement.getBoundingClientRect().x

      mouseDownPos.style.transition = "0.2s ease-in-out"
      mouseDownPos.style.left = event.target.parentElement.getBoundingClientRect().x + "px"
      mouseDownPos.style.top = initTop + "px"

      event.target.parentElement.children[0].style.transition = "0.2s ease-in-out"
      event.target.parentElement.children[0].style.position = "fixed"
      event.target.parentElement.children[0].style.left = initLeft + "px"
      setTimeout(() => {
        event.target.parentElement.children[0].style.transition = "none"
        mouseDownPos.style.transition = "none"
        setSelObj({...selObj, 
          [event.target.parentElement.dataset.index]: {...selObj[event.target.parentElement.dataset.index], 
            position: parseInt(initGCS)-1}, 
            [mouseDownPos.parentElement.dataset.index]: {...selObj[mouseDownPos.parentElement.dataset.index], 
              position: parseInt(newGCS)-1}})        
      }, 200)
            
      mouseDownPos.style.zIndex = 1
    }
    else if (mouseDownPos) {
      mouseDownPos.style.position = "revert";
    }
  }
  useEffect(()=> {
    var obj = {}
    for (var i=0; i < Object.keys(selected).length; i++) {
      obj[i] = {position: i, data: selected[Object.keys(selected)[i]]}
    }
    setSelObj(obj)
  }, [])
  
  
  return (
    <section className={`overlay ${closeCompare ? 'close' : '' }`} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <section className='compare-window' dragger="dragger" 
        style={{"--selected-length": `${Object.keys(selected).length}`,
        "--max-height": `${Math.max(...Object.values(selected)) + 4}px`
      }}
        onMouseDown={handleMouseDown}>
            {Object.keys(selObj).map((i) => {
                return <Box key={i} index={i} position={selObj[i]["position"]} data={selObj[i]["data"]} selected={selected} 
                showCheckBox={false} maxHeight={`${Math.max(...Object.values(selected)) + 4}px`}/>
            })}
            <button className="close-compare" onClick={() => {
              setCloseCompare(true);
              setTimeout(()=>{setComparing(false)}, 400)
              }}><p>+</p></button>
        </section>
    </section>
  )
}

export default Compare
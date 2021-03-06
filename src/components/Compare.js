import React, { useState, useEffect } from 'react'
import Box from './Box.js'
import './Compare.css'

const Compare = ({ selected, setSelected, setComparing }) => {
  const [selObj, setSelObj] = useState({})
  const [closeCompare, setCloseCompare] = useState(false)

  var mouseDownPos = null
  var initTop = null
  var initTop2 = null
  var initLeft2 = null
  const handleMouseDown = (event) => {
    if (event.target.classList.contains("checked-box")) {
      mouseDownPos = event.target.parentElement.children[0]
      mouseDownPos.style.position = "fixed"
      mouseDownPos.style.zIndex = 2
      initTop2 = mouseDownPos.getBoundingClientRect().top
      initLeft2 = mouseDownPos.getBoundingClientRect().left
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
      // mouseDownPos.style.position = "absolute";
      mouseDownPos.style.top = initTop2 + "px"
      mouseDownPos.style.left = initLeft2 + "px";
      mouseDownPos.style.zIndex = 1;
    }
  }
  useEffect(()=> {
    let obj = {}
    let sortable = [];
    console.log(Math.max(...Object.values(selected)))
    for (var item in selected) {
        sortable.push([item, selected[item]]);
    }

    sortable.sort(function(a, b) {
        return parseInt(a[1]) - parseInt(b[1]);
    });
    console.log("sortable",sortable)
    // let objSorted = {}
    // let index = 1
    // sortable.forEach(function(item){
    //     objSorted[index]=item[1]
    //     index += 1 
    // })
    // console.log("objSorted",objSorted)
    // setSelected(objSorted)
    for (var i=0; i < sortable.length; i++) {
      console.log(sortable[i][1])
      obj[i + 1] = {"position": i, "data": sortable[i][1]}
    }
    setSelObj((prevSelObj) => {return obj})
    console.log("selObj" , selObj)
    console.log("selObj",selObj, obj, sortable)
  }, [])
  
  
  
  return (
    <section className={`overlay ${closeCompare ? 'close' : '' }`} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <section className='compare-window' dragger="dragger" 
        style={{"--selected-length": `${Object.keys(selected).length}`,
        "--max-height": `calc(100vh - 80px)`
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
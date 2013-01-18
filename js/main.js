var draggedElement;

function handleDragStart(e) {
    draggedElement = e.toElement;
    e.toElement.style.opacity = '0.8';
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    draggedElement.style.opacity = '1';
    console.log(draggedElement.style);
    draggedElement.style.opacity = '1';
    draggedElement.style.top     = e.pageY + 'px';
    draggedElement.style.left    = e.pageX + 'px';
    console.log("X: "+e.pageX+" Y: "+e.pageY);
}

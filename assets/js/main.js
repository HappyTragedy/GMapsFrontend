let markersAll = [] //Array con todos los markers


// Initialize and add the map
window.initMap = () => {
    //Centro del mapa
    const obelisco = { lat: -34.603544, lng: -58.381586 }; //esto es el centro!
    const map = new google.maps.Map(document.getElementById("map"), { //Creamos el mapa
        zoom: 15,
        center: obelisco,
        styles: styles,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
            mapTypeIds: []
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });
    //Pongo un zoom máximo y zoom mínimo
    map.setOptions({ minZoom: 7, maxZoom: 17 });
    fetchMarkers(map)//Llamo a la función que trae el json

    
    //Aparece y desaparece menú
    const menu = document.getElementsByClassName("maps")[0];
    menu.addEventListener('click', () => {
        document.getElementsByClassName("button")[0].style.display = "none";
        document.getElementsByClassName("button")[0].style.transition = "3s"
        document.getElementsByClassName("menu")[0].style.transform = "translate(415px, 0px)";
        document.getElementsByClassName("menu")[0].style.transition = "1s"
    })

    const close = document.getElementsByClassName("close")[0];
    close.addEventListener('click', () => {
        document.getElementsByClassName("button")[0].style.display = "block";
        document.getElementsByClassName("button")[0].style.transition = "3s"
        document.getElementsByClassName("menu")[0].style.transform = "translate(0px, 0px)";
        document.getElementsByClassName("menu")[0].style.transition = "1.5s"
    })


    //Filtros
    const $filter = document.querySelectorAll('.handleFilter')
    $filter.forEach((filter) => {
        filter.addEventListener('click', () => {
            const filterQuery = filter.innerHTML; //Traigo el query
            addMarkersFiltered(filterQuery, map) //Filtro markers
        })
    })


    //Reset de filtros
    const $filterReset = document.querySelector('.handleFilterReset')
    $filterReset.addEventListener('click', () => {
        markersAll.forEach((marker) => { //Limpiamos el mapa
            marker.setMap(null) //lo quitamos del mapa
        })
        markersAll.forEach((marker) => { //Agregamos los markers filtrados
            marker.setMap(map) //lo agregamos al mapa
        })
    })
}

const addMarkersFiltered = (filterQuery, map) => {
    markersAll.forEach((marker) => { //Limpiamos el mapa
        marker.setMap(null) //lo quitamos del mapa
    })

const markersFiltered = markersAll.filter((marker) => marker.customInfo === filterQuery) //Filtramos por query
    markersFiltered.forEach((marker) => { //Agregamos los markers filtrados
        marker.setMap(map) //lo agregamos al mapa
    })
}


const fetchMarkers = async (map) => {
    try {
        const response = await fetch('http://localhost:3000/markers');
        const json = await response.json();
        json.forEach(marker => addMarker(map, marker))
    } catch (error) {
        console.log(error)
    }
}


const addMarker = (map, marker) => {
    const { nombre, descripcion, ubicacion, horario, telefono, lat, lng, type } = marker
    //Iconos
    const icons = {
        'Pet Shop': 'assets/images/parrot smol.png',
        'Sombrereria': 'assets/images/hat smol.png',
        'Manicura y Pedicura': 'assets/images/hook smol.png',
        'Banco': 'assets/images/treasure smol.png',
        'Barberia': 'assets/images/beard smol.png',
        'Cerveceria': 'assets/images/beer smol.png',
        'Optica': 'assets/images/eye patch smol.png',
        'Banderas': 'assets/images/flag smol.png',
    }

    //MARKER
    const markerItem = new google.maps.Marker(
        {
            position: { lat: parseFloat(lat), lng: parseFloat(lng) },
            map: map,
            icon: icons[type],
            customInfo: type
        }
    );
    markerItem.setMap(map);
    markersAll.push(markerItem); //lo agrego tambien al array de todos los markers

    
    //INFOWINDOW
    const contentString = `
    <div class="info_wrapper">
        <h2>${nombre}</h2>
        <h3>${type}</h3>
        <p>${descripcion}</p>
        <p>${ubicacion}</p>
        <p>${horario}</p>
        <p>${telefono}</p>
    </div>
    `
    const infoWindow = new google.maps.InfoWindow({
        content: contentString
    })
    markerItem.addListener('click', () => {
        infoWindow.open(map, markerItem)
    })
}



//--------------------Cosas del html "admin"--------------------

$("#myForm").validate({

    rules: {
        "id":{
            required: true
        },
        "nombre":{
            required: true
        },
        "descripcion":{
            required: true
        },
        "ubicacion":{
            required: true
        },
        "horario":{
            required: true
        },
        "telefono":{
            required: true
        },
        "lat":{
            required: true
        },
        "lng":{
            required: true
        },
        "type":{
            required: true
        }
    },
    messages: {//En vez de decir "field required" dice lo que ponemos acá abajo.
        "nombre": "Ingrese el nombre del local",
        "descripcion": "Ingrese una corta descripcion",
        "ubicacion": "Ingrese la direccion del local",
        "horario": "Ingrese el horario de apertura y cierre",
        "telefono": "Ingrese el teléfono de contacto",
        "lat": "Ingrese la latitud",
        "lng": "Ingrese la longitud",
        "tipo": "Seleccione el tipo"
    },

    submitHandler: function (form){

        const campos = $(form).serialize()
        
        $.ajax({
            url: form.action,
            type: form.method,
            data: $(form).serialize(),
            beforeSend: function (){
                $('#repuesta_form').html('Espere...');
            },
            success: function (){
                $('#respuesta_form').html('Gracias por agregar un marker uwu')
            }
        })
    }
});

$("#myForm_edit").validate({

    rules: {
        "id":{
            required: true
        },
        "nombre":{
            required: true
        },
        "descripcion":{
            required: true
        },
        "ubicacion":{
            required: true
        },
        "horario":{
            required: true
        },
        "telefono":{
            required: true
        },
        "lat":{
            required: true
        },
        "lng":{
            required: true
        },
        "type":{
            required: true
        }
    },
    messages: {//En vez de decir "field required" dice lo que ponemos acá abajo.
        "nombre": "Ingrese el nombre del local",
        "descripcion": "Ingrese una corta descripcion",
        "ubicacion": "Ingrese la direccion del local",
        "horario": "Ingrese el horario de apertura y cierre",
        "telefono": "Ingrese el teléfono de contacto",
        "lat": "Ingrese la latitud",
        "lng": "Ingrese la longitud",
        "tipo": "Seleccione el tipo"
    },

    submitHandler: function (form){

        const id = $(form).find('input[name="_id"]').val();

        updateData(id, $(form).serialize());
    }
});


const deleteItem = async (id) => {
    try{
        const response = await fetch(`https://gmaps-backend.vercel.app/markers/${id}`,{
            method: 'DELETE'
        })
        const data = await response.json()
        getMarkers();
    }
    catch(error){
        console.log(error)
    }
}

const fillForm = async id =>{
    try{
        const response = await fetch(`https://gmaps-backend.vercel.app/marker/${id}`)
        const data = await response.json()

        const inputs  = document.querySelector("#myForm_edit").elements;
        const inputNombre = inputs["nombre"];
        const inputDescripcion = inputs["descripcion"];
        const inputUbicacion = inputs["ubicacion"];
        const inputHorario = inputs["horario"];
        const inputTelefono = inputs["telefono"];
        const inputLatitud = inputs["lat"];
        const inputLongitud = inputs["lng"];
        const inputTipo = inputs["tipo"];
        const inputID = inputs["_id"];
        const inputEnviar = inputs["editar"];
        
        inputNombre.value = data.nombre
        inputDescripcion.value = data.descripcion
        inputUbicacion.value = data.ubicacion
        inputHorario.value = data.horario
        inputTelefono.value = data.telefono
        inputLatitud.value = data.lat
        inputLongitud.value = data.lng
        inputTipo.value = data.tipo
        inputID.value = data._id
        inputEnviar.value = 'Actualizar'

    }catch(error){
        console.log(error)
    }
}

const updateData = async (id, data)=>{
    try{
        const response = await fetch(`https://gmaps-backend.vercel.app/markers/${id}`, {
                method: 'PUT',
                headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
                body: data
            })
        const data = await response.json()
        getMarkers();
    }
    catch(error){
        console.log(error)
    }
}

const Item = props => {
    const { _id, nombre, descripcion, ubicacion, horario, telefono, lat, lng, type } = props

    return `
    <div class="markersList">
        <p>${nombre}</p>
        <p>${descripcion}</p>
        <p>${ubicacion}</p>
        <p>${horario}</p>
        <p>${telefono}</p>
        <p>${lat}</p>
        <p>${lng}</p>
        <p>${type}</p>
        <button data-id=${_id} class= "edit">Edit</button>
        <button data-id=${_id} class="delete">Delete</button>
    </div>`
}



const $list = document.querySelector('.list');

    const getMarkers = async () => {
        $list.innerHTML = null;

    try {
        const response = await fetch('https://gmaps-backend.vercel.app/markers');
        const items = await response.json();
        items.forEach(item => {
            $list.innerHTML += Item(item)    
        })

        const $editButtons = document.querySelectorAll('.edit') // Selecciono cada elemento edit/delete
            $editButtons.forEach(elem => {
                elem.addEventListener('click',(e)=>{ 
                    e.preventDefault(); 
                    fillForm(elem.dataset.id)
                })
            })

        const $deleteButtons = document.querySelectorAll('.delete')
            $deleteButtons.forEach(elem => {
                elem.addEventListener('click',(e)=>{
                    e.preventDefault(); // Evita el comportamiento default del elemento por ej un boton ser clikceable. 
                    deleteItem(elem.dataset.id)
                })
            })
    }
    catch (error) {
        console.log(error)
    }
}

getMarkers();
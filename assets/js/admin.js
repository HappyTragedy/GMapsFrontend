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
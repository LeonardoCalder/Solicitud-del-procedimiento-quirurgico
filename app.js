document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();
 
  // Obtener los valores del formulario
  const paciente = document.getElementById('paciente').value;
  const consulta = document.getElementById('consulta').value;
  const medico = document.getElementById('medico').value;
  const cedula = document.getElementById('cedula').value;
  const dx = document.getElementById('dx').value;
  const proc = document.getElementById('proc').value;
  const just = document.getElementById('just').value;
  const fechaCita = document.getElementById('fechaCita').value;
  const hora = document.getElementById('hora').value;
 
  // Construir el objeto con los datos de la solicitud médica
  const serviceRequestData = {
    paciente: paciente,
    consulta: consulta,
    medico: medico,
    cedula: cedula,
    diagnostico: dx,
    procedimiento: proc,
    justificacion: just,
    fechaCita: fechaCita,
    hora: hora
  };
 
  console.log(serviceRequestData);
 
  // Enviar la solicitud al backend (con trailing slash)
  fetch('https://hl7-fhir-ehr-leonardo.onrender.com/service-request/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceRequestData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Service Request creado exitosamente! ID: ' + data._id);
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error en la solicitud: ' + error.message);
  });
});

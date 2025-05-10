document.getElementById('form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Leer campos del formulario
  const pacienteId     = document.getElementById('paciente').value;
  const procedimiento  = document.getElementById('proc').value; // Ej: Apendicectomía
  const medicoId       = document.getElementById('medico').value;
  const prioridad      = document.getElementById('prioridad').value; // Ej: urgent
  const fechaSolicitud = document.getElementById('fechaCita').value;
  const horaSolicitud  = document.getElementById('hora').value;

  // Crear un identificador único para la solicitud
  const identificador = 'SR-' + Date.now();

  // Construcción del recurso FHIR ServiceRequest
  const serviceRequestFHIR = {
    resourceType: 'ServiceRequest',
    id: identificador,
    status: 'active',
    intent: 'order',
    priority: prioridad, // Ej: "urgent", "routine", etc.
    code: {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '80146002', // Código SNOMED para apendicectomía
          display: procedimiento
        }
      ],
      text: procedimiento
    },
    subject: {
      reference: `Patient/${pacienteId}`
    },
    requester: {
      reference: `Practitioner/${medicoId}`
    },
    authoredOn: `${fechaSolicitud}T${horaSolicitud}:00Z`
  };

  console.log('Enviando FHIR ServiceRequest:', serviceRequestFHIR);

  fetch('https://hl7-fhir-ehr-leonardo.onrender.com/fhir/ServiceRequest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceRequestFHIR)
  })
  .then(async response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }

    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const data = await response.json();
      console.log('Success:', data);
      alert('Service Request creado exitosamente! ID: ' + data.id);
    } else {
      alert('Service Request enviado, pero sin respuesta en JSON.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Hubo un error en la solicitud: ' + error.message);
  });
});

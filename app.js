document.getElementById('serviceRequestForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Obtener valores del formulario
  const patientId = document.getElementById('patientId').value;
  const patientName = document.getElementById('patientName').value;
  const birthDate = document.getElementById('patientBirthDate').value;
  const gender = document.getElementById('patientGender').value;
  const requesterName = document.getElementById('requester').value;
  const procedureCode = document.getElementById('procedureCode').value;
  const procedureDescription = document.getElementById('procedureDescription').value;
  const requestDate = document.getElementById('requestDate').value;
  const priority = document.getElementById('priority').value;

  // Construir el recurso FHIR ServiceRequest
  const serviceRequest = {
    resourceType: "ServiceRequest",
    status: "active",
    intent: "order",
    priority: priority, // routine | urgent | stat
    code: {
      coding: [
        {
          system: "http://snomed.info/sct", // asumiendo SNOMED CT
          code: procedureCode,
          display: procedureDescription
        }
      ],
      text: procedureDescription
    },
    subject: {
      reference: `Patient/${patientId}`,
      display: patientName
    },
    requester: {
      reference: `Practitioner/${requesterName.replace(/\s+/g, '-').toLowerCase()}`,
      display: requesterName
    },
    authoredOn: requestDate,
    identifier: [
      {
        system: "https://hospital-ejemplo.org/solicitudes",
        value: `SR-${patientId}-${Date.now()}`
      }
    ]
  };

  console.log('Recurso FHIR a enviar:', serviceRequest);

  // Enviar al backend
  fetch('https://hl7-fhir-ehr-leonardo.onrender.com/service-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(serviceRequest)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      document.getElementById('result').innerHTML = `
        <div class="success">
          <h3>¡Solicitud creada con éxito!</h3>
          <p><strong>ID del Recurso:</strong> ${data.id || 'No disponible'}</p>
          <p><strong>Paciente:</strong> ${patientName}</p>
          <p><strong>Procedimiento:</strong> ${procedureDescription}</p>
          <p><strong>Solicitado por:</strong> ${requesterName}</p>
          <p><strong>Fecha:</strong> ${requestDate}</p>
        </div>
      `;
      document.getElementById('serviceRequestForm').reset();
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = `
        <div class="error">
          <h3>Error al crear la solicitud</h3>
          <p>${error.message}</p>
        </div>
      `;
    });
});

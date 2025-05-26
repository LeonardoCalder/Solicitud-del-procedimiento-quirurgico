document.getElementById('serviceRequestForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Recopilar los datos del formulario
  const patientId = document.getElementById('patientId').value;
  const requesterName = document.getElementById('requester').value;

  const serviceRequest = {
    resourceType: "ServiceRequest",
    status: "active",
    intent: "order",
    code: {
      coding: [{
        system: "http://snomed.info/sct",
        code: document.getElementById('procedureCode').value,
        display: document.getElementById('procedureDescription').value
      }],
      text: document.getElementById('procedureDescription').value
    },
    subject: {
      reference: `Patient/${patientId}`,
      display: document.getElementById('patientName').value
    },
    authoredOn: document.getElementById('requestDate').value,
    requester: {
      reference: `Practitioner/${requesterName.replace(/\s+/g, '_')}`,
      display: requesterName
    },
    priority: document.getElementById('priority').value
  };

  console.log('Recurso FHIR:', serviceRequest);

  // Enviar al backend
  fetch('https://hl7-fhir-ehr-leonardo.onrender.com/service-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serviceRequest)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    document.getElementById('result').innerHTML = `
      <div style="background-color: #e0fff8; border-left: 6px solid #00b4a0; padding: 16px; border-radius: 8px;">
        <h3 style="color: #006b5f;">¡Solicitud enviada con éxito!</h3>
        <p><strong>ID generado:</strong> ${data.id || 'N/A'}</p>
        <p><strong>Paciente:</strong> ${serviceRequest.subject.display}</p>
        <p><strong>Procedimiento:</strong> ${serviceRequest.code.text}</p>
        <p><strong>Médico Solicitante:</strong> ${serviceRequest.requester.display}</p>
        <p><strong>Fecha:</strong> ${serviceRequest.authoredOn}</p>
      </div>
    `;
    document.getElementById('serviceRequestForm').reset();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').innerHTML = `
      <div style="background-color: #ffe6e6; border-left: 6px solid #f44336; padding: 16px; border-radius: 8px;">
        <h3 style="color: #a94442;">Error al crear la solicitud</h3>
        <p>${error.message}</p>
      </div>
    `;
  });
});

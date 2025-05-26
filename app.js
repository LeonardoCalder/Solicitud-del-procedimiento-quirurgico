document.getElementById('serviceRequestForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const serviceRequestData = {
    patient_id: document.getElementById('patientId').value,
    patient_name: document.getElementById('patientName').value,
    patient_birth_date: document.getElementById('patientBirthDate').value,
    patient_gender: document.getElementById('patientGender').value,
    requester: document.getElementById('requester').value,
    procedure_code: document.getElementById('procedureCode').value,
    procedure_description: document.getElementById('procedureDescription').value,
    request_date: document.getElementById('requestDate').value,
    priority: document.getElementById('priority').value
  };

  console.log('Datos a enviar:', serviceRequestData);

  // Enviar la solicitud al backend
  fetch('https://hl7-fhir-ehr-solangie-9665.onrender.com/service-request', {
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
    document.getElementById('result').innerHTML = `
      <div style="background-color: #e6ffe6; border-left: 6px solid #4CAF50; padding: 16px; margin-top: 20px; border-radius: 8px;">
        <h3 style="color: #2d662d;">¡Servicio registrado exitosamente!</h3>
        <p><strong>ID:</strong> ${data._id}</p>
        <p><strong>Paciente:</strong> ${serviceRequestData.patient_name}</p>
        <p><strong>Procedimiento:</strong> ${serviceRequestData.procedure_description}</p>
        <p><strong>Solicitado por:</strong> ${serviceRequestData.requester}</p>
        <p><strong>Fecha:</strong> ${serviceRequestData.request_date}</p>
      </div>
    `;
    document.getElementById('serviceRequestForm').reset();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').innerHTML = `
      <div style="background-color: #ffe6e6; border-left: 6px solid #f44336; padding: 16px; margin-top: 20px; border-radius: 8px;">
        <h3 style="color: #a94442;">Error al crear la solicitud</h3>
        <p>${error.message}</p>
      </div>
    `;
  });
});

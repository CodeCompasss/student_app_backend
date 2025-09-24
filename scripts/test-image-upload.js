const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');

// Test image path - using a sample image from the public directory
const testImagePath = path.join(__dirname, '../public/codecompass.png');
const API_BASE_URL = 'http://localhost:3000/api';

async function testImageUpload() {
  try {
    console.log('Starting image upload test...');
    
    // 1. Create a new event with an image
    const formData = new FormData();
    formData.append('title', 'Test Event with Image');
    formData.append('description', 'This is a test event with an image');
    formData.append('venue', 'Test Venue');
    formData.append('date', new Date().toISOString());
    formData.append('time', '15:00');
    formData.append('image', fs.createReadStream(testImagePath));

    console.log('Creating new event with image...');
    const createResponse = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      body: formData,
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create event: ${error}`);
    }

    const createdEvent = await createResponse.json();
    console.log('✅ Event created successfully:', createdEvent.id);
    console.log('Event image data:', createdEvent.imageData ? 'Image exists' : 'No image');

    // 2. Get the created event
    console.log('\nFetching created event...');
    const getResponse = await fetch(`${API_BASE_URL}/events/${createdEvent.id}`);
    
    if (!getResponse.ok) {
      throw new Error('Failed to fetch created event');
    }

    const fetchedEvent = await getResponse.json();
    console.log('✅ Event retrieved successfully');
    console.log('Fetched event image data:', fetchedEvent.imageData ? 'Image exists' : 'No image');

    // 3. Get all events
    console.log('\nFetching all events...');
    const getAllResponse = await fetch(`${API_BASE_URL}/events`);
    
    if (!getAllResponse.ok) {
      throw new Error('Failed to fetch all events');
    }

    const allEvents = await getAllResponse.json();
    console.log(`✅ Retrieved ${allEvents.length} events`);
    console.log('First event image data:', allEvents[0]?.imageData ? 'Image exists' : 'No image');

    console.log('\n✅ All tests passed successfully!');
    console.log('You can check the event data in your database or via the API endpoints.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testImageUpload();

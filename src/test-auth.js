// Test script to check authentication and permissions
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Test user credentials
const adminUser = {
  email: 'admin@example.com',
  password: 'Password123!',
};

async function runTests() {
  console.log('🔍 Starting authentication tests...');
  
  try {
    // Step 1: Login as admin
    console.log('Step 1: Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/api/users/login`, adminUser);
    const { token } = loginResponse.data;
    
    if (!token) {
      throw new Error('Login failed - no token received');
    }
    
    console.log('✅ Login successful, received token');
    
    // Set up authenticated headers
    const authHeaders = {
      headers: {
        Authorization: `JWT ${token}`,
      },
    };
    
    // Step 2: Get current user to verify authentication
    console.log('Step 2: Verifying current user...');
    const meResponse = await axios.get(`${API_URL}/api/users/me`, authHeaders);
    console.log(`✅ Authenticated as: ${meResponse.data.user.email} (${meResponse.data.user.role})`);
    
    // Step 3: Try to create a test user
    console.log('Step 3: Creating a test user...');
    const newUser = {
      email: `test-user-${Date.now()}@example.com`,
      password: 'TestUser123!',
      role: 'user',
    };
    
    const createUserResponse = await axios.post(`${API_URL}/api/users`, newUser, authHeaders);
    console.log(`✅ Created test user: ${createUserResponse.data.email}`);
    
    // Step 4: Try to create a test product
    console.log('Step 4: Creating a test product...');
    const testProduct = {
      title: `Test Product ${Date.now()}`,
      price: 99.99,
      currency: 'USD',
      category: 'accessories',
      serviceType: 'product',
      description: 'This is a test product',
    };
    
    try {
      const createProductResponse = await axios.post(`${API_URL}/api/products`, testProduct, authHeaders);
      console.log(`✅ Created test product: ${createProductResponse.data.title}`);
    } catch (error) {
      console.error('❌ Failed to create product:', error.response?.data || error.message);
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

runTests();
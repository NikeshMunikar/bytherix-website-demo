// Creates application user with least-privilege access
// Root credentials are only for this init script
db = db.getSiblingDB('bytherix');

db.createUser({
  user: _getEnv('MONGO_USERNAME') || 'bx_user',
  pwd:  _getEnv('MONGO_PASSWORD') || 'bx_pass',
  roles: [
    { role: 'readWrite', db: 'bytherix' },
  ],
});

// Create initial collections with validators
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'firstName', 'lastName', 'role'],
      properties: {
        email:     { bsonType: 'string' },
        password:  { bsonType: 'string' },
        firstName: { bsonType: 'string' },
        lastName:  { bsonType: 'string' },
        role:      { bsonType: 'string', enum: ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] },
      },
    },
  },
});

db.createCollection('sessions');
db.createCollection('auditlogs');
db.createCollection('courses');

print('Bytherix DB initialized successfully');
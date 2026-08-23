const pg = require('pg');
try {
  new pg.Pool({ connectionString: process.env.NON_EXISTENT_VAR });
  console.log("OK");
} catch(e) {
  console.error(e.message);
}
